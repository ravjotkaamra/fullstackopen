import React from "react";
import { List } from "semantic-ui-react";
import { Entry } from "../types";
import EntryDetails from "./EntryDetails";

const EntryList = ({ entries }: { entries: Entry[] | undefined }) => {
  if (!entries) {
    return <div>no entries available</div>;
  }
  return (
    <List>
      {entries.map((e) => (
        <EntryDetails key={e.id} entry={e} />
      ))}
    </List>
  );
};

export default EntryList;
