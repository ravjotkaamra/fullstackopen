import React from "react";
import { Entry } from "../types";
import HealthCheck from "./HealthCheck";
import Hospital from "./Hospital";
import OccupationalHealthcare from "./OccupationalHealthcare";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <Hospital entry={entry} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;

{
  /* <List.Item key={e.id}>
          <p>
            <strong>{e.date}</strong> <em>{e.description}</em>
          </p>

          <List.List as="ul">
            {e.diagnosisCodes &&
              e.diagnosisCodes.map((code) => (
                <List.Item as="li" key={code}>
                  {code} {diagnoses && diagnoses[code].name}
                </List.Item>
              ))}
          </List.List>
        </List.Item> */
}
