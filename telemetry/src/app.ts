import express from "express";
import { config } from "dotenv";

config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
