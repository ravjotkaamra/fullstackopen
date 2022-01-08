import diagnosesJson from "../../data/diagnoses.json";
import { Diagnosis } from "../types";

const diagnoses: Diagnosis[] = diagnosesJson as Diagnosis[];

const getEntries = (): Diagnosis[] => {
  return diagnoses;
};

export default { getEntries };
