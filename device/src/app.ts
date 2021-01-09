import express from "express";
import { config } from "dotenv";
import { keycloak, memoryStore } from "./services/keycloak";
import { initKeycloak } from "./services/axios";
import session from "express-session";
import deviceRouter from "./routes/devices";
import telemetryRouter from "./routes/telemetries";

config();
const main = async () => {
  const app = express();
  try {
    await initKeycloak();
  } catch (err) {
    console.log("error during init keycloak");
    console.log(err);
  }

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

  app.use("/api/devices", deviceRouter);
  app.use("/api/telemetries", telemetryRouter);

  app.use("*", (_req, res) => {
    res.status(404).send("Not found!");
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

main();
