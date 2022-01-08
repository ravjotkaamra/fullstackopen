import { NewPatient, Gender } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (str: unknown, name: string): string => {
  if (!str || !isString(str)) {
    throw new Error(`Incorrect or missing ${name}`);
  }

  return str;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatientEntry = (obj: any): NewPatient => {
  const newEntry: NewPatient = {
    name: parseString(obj.name, "name"),
    dateOfBirth: parseDate(obj.dateOfBirth),
    ssn: parseString(obj.ssn, "ssn"),
    gender: parseGender(obj.gender),
    occupation: parseString(obj.occupation, "occupation"),
  };

  return newEntry;
};

export default toNewPatientEntry;
