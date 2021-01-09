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
    return res.status(200).json(JSON.parse(devices));
  });
});

app.use("*", function (req, res) {
  res.status(404).send("Not found!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
