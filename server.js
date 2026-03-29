const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DOWNLOADS = path.join(__dirname, "uploads");
if (!fs.existsSync(DOWNLOADS)) fs.mkdirSync(DOWNLOADS);

app.post("/download", (req, res) => {
  const { url, format } = req.body;

  if (!url || (!url.includes("youtube.com") && !url.includes("youtu.be"))) {
    return res.status(400).json({ error: "Only YouTube links allowed" });
  }

  const output = `uploads/%(title)s.%(ext)s`;

  let command;
  if (format === "mp3") {
    command = `yt-dlp -x --audio-format mp3 -o "${output}" "${url}"`;
  } else {
    command = `yt-dlp -f best -o "${output}" "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      return res.status(500).json({ error: "Download failed" });
    }

    const files = fs.readdirSync(DOWNLOADS);
    const latest = files
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(DOWNLOADS, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time)[0];

    res.json({
      success: true,
      file: `/uploads/${latest.name}`
    });
  });
});

app.use("/uploads", express.static("uploads"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
