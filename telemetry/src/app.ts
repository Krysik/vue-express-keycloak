import express, { Express } from "express";
import { config } from "dotenv";
import fs from "fs";
import session from "express-session";
import { keycloak, memoryStore } from "./services/keycloak";
import { initKeycloak } from "./services/axios";

config();
const main = async () => {
  const app = express();

  appSetup(app);
  await initializeKeycloak();

  app.get("/telemetry", (req, res) => {
    fs.readFile("database.json", "utf8", (err, telemetry) => {
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
    fs.readFile("database.json", "utf8", (err, data) => {
      if (err) {
        return console.log(err);
      }

      const telemetries = JSON.parse(data);
      telemetries.telemetries.push(telemetry);

      fs.writeFile("database.json", JSON.stringify(telemetries), (err) => {
        if (err) {
          return console.log(err);
        }
        console.log("saved successfully");
        return res
          .status(201)
          .json({ ok: true, message: "Telemetry created successfully" });
      });
    });
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

const initializeKeycloak = async () => {
  try {
    await initKeycloak();
  } catch (err) {
    console.log("error during init keycloak");
    console.log(err);
  }
};

const appSetup = (app: Express) => {
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
};

main();
