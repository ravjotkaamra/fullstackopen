import React from "react";
import { List } from "semantic-ui-react";
import { useStateValue } from "../state";
import { Diagnosis } from "../types";

const DiagnosisCodes: React.FC<{
  diagnosisCodes: Array<Diagnosis["code"]>;
}> = ({ diagnosisCodes }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <List.List as="ul">
      {diagnosisCodes &&
        diagnosisCodes.map((code) => (
          <List.Item as="li" key={code}>
            {code} {diagnoses && diagnoses[code].name}
          </List.Item>
        ))}
    </List.List>
  );
};

export default DiagnosisCodes;
