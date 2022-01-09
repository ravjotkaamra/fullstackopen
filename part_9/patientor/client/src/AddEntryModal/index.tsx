import React, { useState } from "react";
import { Dropdown, Header, Modal, Segment } from "semantic-ui-react";
import HealthCheckEntryForm from "./HealthCheckEntryForm";
import HospitalEntryForm from "./HospitalEntryForm";
import OccupationalHealthCareEntryForm from "./OccupationalHealthCareEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  error?: string;
}

const options = [
  { key: 1, text: "HealthCheck", value: "HealthCheck" },
  { key: 2, text: "OccupationalHealthCare", value: "OccupationalHealthCare" },
  { key: 3, text: "Hospital", value: "Hospital" },
];

const AddEntryModal = ({ modalOpen, onClose, error }: Props) => {
  const [type, setType] = useState<string>("");

  const AddEntryForm = () => {
    switch (type) {
      case "HealthCheck":
        return <HealthCheckEntryForm onCancel={onClose} />;
      case "OccupationalHealthCare":
        return <OccupationalHealthCareEntryForm onCancel={onClose} />;
      case "Hospital":
        return <HospitalEntryForm onCancel={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new patient</Modal.Header>
      <Modal.Content>
        {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
        {/* <AddPatientForm onSubmit={onSubmit} onCancel={onClose} /> */}
        <Header as="h4">Choose Entry Type</Header>
        <div style={{ marginBottom: 20 }}>
          <Dropdown
            clearable
            options={options}
            selection
            placeholder="Type"
            value={type}
            onChange={(e, { value }) =>
              setType(typeof value === "string" ? value : "")
            }
          />
        </div>

        <AddEntryForm />
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;
