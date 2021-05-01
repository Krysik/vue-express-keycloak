import express from "express";
import { Axios } from "../services/axios";
import { keycloak } from "../services/keycloak";

const router = express.Router();

const TELEMETRY_URL = process.env.TELEMETRY_URL;

router.get("/", keycloak.protect(), async (_req, res) => {
  // const { data } = await Axios.get(`${TELEMETRY_URL}/telemetry`);
  res.status(200).json({ ok: true });
});

let id = 1;

const sendTelemetry = async () => {
  const sampleData = {
    id,
    deviceId: Math.floor(Math.random() * 4) + 1,
    enabled: Math.random() > 0.5 ? true : false,
    duty: Math.floor(Math.random() * 101),
  };
  try {
    const { data } = await Axios.post(`${TELEMETRY_URL}/telemetry`, sampleData);
    console.log(data);
    id++;
  } catch (err) {
    console.log(err);
  }
};

// setInterval(sendTelemetry, 60_000);

export default router;
