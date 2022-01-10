import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Header, Icon } from "semantic-ui-react";
import AddEntryModal from "../AddEntryModal";
import { apiBaseUrl } from "../constants";
import { updatePatient, useStateValue } from "../state";
import { Patient } from "../types";
import EntryList from "./EntryList";

const PatientDetailPage = () => {
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const { id } = useParams<{ id: string }>();
  const patient = patients[id];

  useEffect(() => {
    const fetchPatientById = async () => {
      try {
        const { data: updatedPatient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(updatePatient(updatedPatient));
      } catch (error: unknown) {
        console.log({ error });
      }
    };
    if (patient && !patient.ssn) {
      console.log(`fetching patient info with id: ${id}`);
      void fetchPatientById();
    }
  }, [patient]);

  if (!patient) {
    return <div>Error: Patient does not exist</div>;
  }

  const showIcon = (): JSX.Element => {
    switch (patient.gender) {
      case "male":
        return <Icon name="man" />;
      case "female":
        return <Icon name="woman" />;
      case "other":
        return <Icon name="other gender" />;
      default:
        return <Icon name="user" />;
    }
  };

  return (
    <section>
      <div>
        <Header as="h2">
          {showIcon()}
          <Header.Content>{patient.name}</Header.Content>
        </Header>
        <Container>
          <div>ssn: {patient.ssn}</div>
          <div>occupation: {patient.occupation}</div>
        </Container>
      </div>

      <div style={{ marginTop: 30 }}>
        <Header as="h3">entries</Header>
        <EntryList entries={patient.entries} />
      </div>

      <div style={{ marginTop: 30 }}>
        <AddEntryModal
          modalOpen={modalOpen}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()} color="instagram">
          Add New Entry
        </Button>
      </div>
    </section>
  );
};

export default PatientDetailPage;
