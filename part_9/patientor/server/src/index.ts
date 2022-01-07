import express from "express";
import cors from "cors";
import diagnoseRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnoseRouter);
app.use("/api/patients", patientRouter);

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
