import React from "react";
import { Card, Icon } from "semantic-ui-react";
import { HealthCheckEntry } from "../types";
import DiagnosisCodes from "./DiagnosisCodes";

const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  const HealthIcon = ({ rating }: { rating: number }) => {
    switch (rating) {
      case 0:
        return <Icon name="heart" color="green" />;
      case 1:
        return <Icon name="heart" color="olive" />;
      case 2:
        return <Icon name="heart" color="orange" />;
      case 3:
        return <Icon name="heart" color="red" />;
      default:
        return <Icon name="heart" color="green" />;
    }
  };
  return (
    <Card fluid color="grey">
      <Card.Content>
        <Card.Header>
          {entry.date}
          <Icon name="doctor" size="big" />
        </Card.Header>
        <Card.Meta>{entry.description}</Card.Meta>
        <Card.Description>
          <HealthIcon rating={entry.healthCheckRating} />
          {entry.diagnosisCodes && (
            <DiagnosisCodes diagnosisCodes={entry.diagnosisCodes} />
          )}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

export default HealthCheck;
