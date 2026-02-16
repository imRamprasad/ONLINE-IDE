import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/execute", async (req, res) => {
  try {
    const response = await fetch(PISTON_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await response.text();
    res.status(response.status);
    res.set("Content-Type", response.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (error) {
    return res.status(502).json({
      error: "Proxy failed to reach Piston",
      details: error?.message || String(error),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Piston proxy running on http://localhost:${PORT}`);
});
