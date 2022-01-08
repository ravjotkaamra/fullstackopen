import { Patient, PublicPatient, NewPatient } from "../types";
import patients from "../../data/patients";
import { v4 as uuidv4 } from "uuid";

const getEntries = (): Patient[] => {
  return patients;
};

const getNonSensitiveEntries = (): PublicPatient[] => {
  return patients.map(({ id, name, gender, occupation, dateOfBirth }) => ({
    id,
    name,
    gender,
    occupation,
    dateOfBirth,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    ...entry,
    id: uuidv4(),
  };

  patients.push(newPatient);
  return newPatient;
};

const findById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  findById,
};
