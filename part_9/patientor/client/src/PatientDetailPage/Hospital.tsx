import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { HospitalEntry } from "../types";
import DiagnosisCodes from "./DiagnosisCodes";

const Hospital: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <Card fluid color="pink">
      <Card.Content>
        <Card.Header>
          {entry.date}
          <Icon name="hospital outline" size="big" />
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

export default Hospital;
