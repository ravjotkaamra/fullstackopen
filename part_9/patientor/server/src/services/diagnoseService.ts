import diagnosesJson from "../../data/diagnoses.json";
import { DiagnoseEntry } from "../types";

const diagnoses: DiagnoseEntry[] = diagnosesJson as DiagnoseEntry[];

const getEntries = (): DiagnoseEntry[] => {
  return diagnoses;
};

export default { getEntries };
