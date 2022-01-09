import {
  NewPatient,
  Gender,
  EntryWithoutId,
  HealthCheckEntry,
  OccupationalHealthCareEntry,
  HospitalEntry,
  HealthCheckRating,
  Diagnosis,
  SickLeave,
  Discharge,
} from "./types";

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
const toNewPatient = (obj: any): NewPatient => {
  const newEntry: NewPatient = {
    name: parseString(obj.name, "name"),
    dateOfBirth: parseDate(obj.dateOfBirth),
    ssn: parseString(obj.ssn, "ssn"),
    gender: parseGender(obj.gender),
    occupation: parseString(obj.occupation, "occupation"),
  };

  return newEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthRating = (param: any): param is HealthCheckRating => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(HealthCheckRating).includes(param);
};
const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!rating || !isHealthRating(rating)) {
    throw new Error("Incorrect or missing HealthCheckRating: " + rating);
  }
  return rating;
};

const parseDiagnosisCodes = (
  codes: unknown
): Array<Diagnosis["code"]> | undefined => {
  if (codes === undefined) {
    return undefined;
  }

  if (
    Array.isArray(codes) &&
    codes.every((code) => typeof parseString(code, "code") === "string")
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return codes;
  }

  throw new Error("diagnosisCodes is not an array of string");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSickLeave = (sickLeave: any): SickLeave | undefined => {
  if (!sickLeave) {
    return undefined;
  }

  const startDate = parseDate(sickLeave.startDate);
  const endDate = parseDate(sickLeave.endDate);
  return { startDate, endDate };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDischarge = (discharge: any): Discharge => {
  if (!discharge) {
    throw new Error(
      "Missing discharge parameter, required date and criteria object"
    );
  }

  const criteria = parseString(discharge.criteria, "discharge criteria");
  const date = parseDate(discharge.date);
  return { criteria, date };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toHealthCheckEntry = (obj: any): Omit<HealthCheckEntry, "id"> => ({
  date: parseDate(obj.date),
  description: parseString(obj.description, "description"),
  type: "HealthCheck",
  specialist: parseString(obj.specialist, "specialist"),
  healthCheckRating: parseHealthCheckRating(obj.healthCheckRating),
  diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes),
});

const toOccupationalHealthcareEntry = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any
): Omit<OccupationalHealthCareEntry, "id"> => ({
  date: parseDate(obj.date),
  description: parseString(obj.description, "description"),
  type: "OccupationalHealthcare",
  specialist: parseString(obj.specialist, "specialist"),
  employerName: parseString(obj.employerName, "employer name"),
  diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes),
  sickLeave: parseSickLeave(obj.sickLeave),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toHospitalEntry = (obj: any): Omit<HospitalEntry, "id"> => ({
  date: parseDate(obj.date),
  description: parseString(obj.description, "description"),
  type: "Hospital",
  specialist: parseString(obj.specialist, "specialist"),
  diagnosisCodes: parseDiagnosisCodes(obj.diagnosisCodes),
  discharge: parseDischarge(obj.discharge),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewEntry = (obj: any): EntryWithoutId => {
  switch (obj.type) {
    case "HealthCheck":
      return toHealthCheckEntry(obj);
    case "OccupationalHealthcare":
      return toOccupationalHealthcareEntry(obj);
    case "Hospital":
      return toHospitalEntry(obj);
    default:
      throw new Error("Entry 'type' field is incorrect or missing");
  }
};

export default { toNewPatient, toNewEntry };
// export default { toNewPatient };
