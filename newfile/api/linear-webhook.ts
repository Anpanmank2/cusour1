// api/linear-webhook.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  // 1) LinearのWebhookイベントpayload（Issue作成など）が req.body に来る
  const payload = req.body;

  // 2) 必要ならここで「Analysis RequestがあるIssueだけ」などフィルタ
  //    payload.data / payload.type 等をログして後で整える（まずは起動優先）

  // 3) GitHub Actions を repository_dispatch で起動
  const owner = process.env.GH_OWNER!;
  const repo = process.env.GH_REPO!;
  const token = process.env.GH_TOKEN!;

  const dispatchBody = {
    event_type: "linear_analysis_request",
    client_payload: {
      linear: payload,
    },
  };

  const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(dispatchBody),
  });

  if (!r.ok) {
    const text = await r.text();
    return res.status(500).json({ ok: false, error: text });
  }

  return res.status(200).json({ ok: true });
}
