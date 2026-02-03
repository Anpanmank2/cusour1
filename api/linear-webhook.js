// api/linear-webhook.js
module.exports = async (req, res) => {
  // GETでも動作確認できるようにしておく
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, route: "/api/linear-webhook" });
  }
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  return res.status(200).json({ ok: true });
};
