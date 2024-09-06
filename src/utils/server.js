import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "../config/database/database.config.js";

export const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
});
