import express from "express";
import { config } from "dotenv";
import fs from "fs";

config();

const app = express();

app.use(express.json());

app.get("/api/devices", (req, res) => {
  fs.readFile("db.json", "utf8", (err, devices) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ ok: false, message: "internal server error" });
    }
    return res.json(JSON.parse(devices));
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
