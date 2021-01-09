import axios from "axios";
import express from "express";
import { config } from "dotenv";
import session from "express-session";
import Keycloak from "keycloak-connect";
import fs from "fs";

config();

const app = express();
const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore });

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(
  keycloak.middleware({
    logout: "/logout",
    admin: "/",
  })
);

app.get("/test", (_req, res) => {
  res.send("Not secured endpoint");
});

app.get("/api/devices", keycloak.protect(), (req, res) => {
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

app.get("/api/telemetry", keycloak.protect(), async (_req, res) => {
  const { data } = await axios.get("http://localhost:4001/telemetry");
  res.status(200).json(data);
});

app.use("*", (_req, res) => {
  res.status(404).send("Not found!");
});

let id = 1;

const sendTelemetry = async () => {
  const sampleData = {
    id,
    deviceId: Math.floor(Math.random() * 4) + 1,
    enabled: Math.random() > 0.5 ? true : false,
    duty: Math.floor(Math.random() * 101),
  };
  const { data } = await axios.post(
    "http://localhost:4001/telemetry",
    sampleData
  );
  console.log(data);

  id++;
};

setInterval(sendTelemetry, 60_000);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
