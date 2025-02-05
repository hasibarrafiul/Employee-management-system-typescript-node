import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes";
import { AppDataSource } from "./config/database";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);

AppDataSource.initialize()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

export default app;
