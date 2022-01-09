import { Patient, PublicPatient, NewPatient, EntryWithoutId } from "../types";
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

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuidv4(),
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntryToPatientWithId = (
  id: string,
  entry: EntryWithoutId
): Patient => {
  const idx = patients.findIndex((p) => p.id === id);
  if (idx >= 0) {
    const patient = patients[idx];
    const newEntry = { ...entry, id: uuidv4() };

    patient.entries = patient.entries
      ? [...patient.entries, newEntry]
      : [newEntry];

    patients[idx] = patient;
    return patient;
  } else {
    throw new Error(`Patient with id ${id} not found!`);
  }
};

const findById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  addEntryToPatientWithId,
  findById,
};
