import express from "express";
import { config } from "dotenv";
import fs from "fs";
import Keycloak from "keycloak-connect";
import session from "express-session";

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

app.get("/telemetry", (req, res) => {
  fs.readFile("db.json", "utf8", (err, telemetry) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ ok: false, message: "internal server error" });
    }
    return res.status(200).json(JSON.parse(telemetry).telemetries);
  });
});

app.post("/telemetry", keycloak.protect(), (req, res) => {
  const telemetry = req.body;
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      return console.log(err);
    }

    const telemetries = JSON.parse(data);
    telemetries.telemetries.push(telemetry);

    fs.writeFile("db.json", JSON.stringify(telemetries), (err) => {
      if (err) {
        return console.log(err);
      }
      console.log("saved successfully");
    });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
