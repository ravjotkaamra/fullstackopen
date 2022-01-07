import express from "express";
import patientService from "../services/patientService";
import toNewPatientEntry from "../utils";

const patientRouter = express.Router();

patientRouter.get("/", (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

patientRouter.get("/:id", (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

patientRouter.post("/", (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatientEntry = toNewPatientEntry(req.body);

    const addedEntry = patientService.addPatient(newPatientEntry);

    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default patientRouter;
