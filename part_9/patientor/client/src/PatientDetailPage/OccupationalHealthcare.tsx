import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { OccupationalHealthCareEntry } from "../types";
import DiagnosisCodes from "./DiagnosisCodes";

const OccupationalHealthcare: React.FC<{
  entry: OccupationalHealthCareEntry;
}> = ({ entry }) => {
  return (
    <Card fluid color="purple">
      <Card.Content>
        <Card.Header>
          {entry.date}
          <Icon name="stethoscope" size="big" />
          <Icon>{entry.employerName}</Icon>
        </Card.Header>
        <Card.Meta>{entry.description}</Card.Meta>
        <Card.Description>
          {entry.diagnosisCodes && (
            <DiagnosisCodes diagnosisCodes={entry.diagnosisCodes} />
          )}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default OccupationalHealthcare;
