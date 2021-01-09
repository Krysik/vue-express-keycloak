import express from "express";
import fs from "fs";
import { keycloak } from "../services/keycloak";

const router = express.Router();

router.get("/", keycloak.protect(), (req, res) => {
  fs.readFile("db.json", "utf8", (err, devices) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ ok: false, message: "internal server error" });
    }
    return res.status(200).json(JSON.parse(devices).devices);
  });
});

export default router;
