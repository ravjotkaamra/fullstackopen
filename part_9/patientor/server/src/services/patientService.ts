import {
  PatientEntry,
  NonSensitivePatientEntry,
  NewPatientEntry,
} from "../types";
import patientsJson from "../../data/patients.json";
// import uuid = require("uuid");
import { v4 as uuidv4 } from "uuid";

const patients: PatientEntry[] = patientsJson as PatientEntry[];

const getEntries = (): PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, gender, occupation, dateOfBirth }) => ({
    id,
    name,
    gender,
    occupation,
    dateOfBirth,
  }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    ...entry,
    id: uuidv4(),
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  return patients.find((p) => p.id === id);
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
};
