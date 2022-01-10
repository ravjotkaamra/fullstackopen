import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { setDiagnosisList, setPatientList, useStateValue } from "./state";
import { Diagnosis, Patient } from "./types";

import PatientListPage from "./PatientListPage";
import PatientDetailPage from "./PatientDetailPage";

const App = () => {
  const [, dispatch] = useStateValue();
  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientAndDiagnosisList = async () => {
      try {
        // get the promise objects
        const patientsRequest = axios.get<Patient[]>(`${apiBaseUrl}/patients`);
        const diagnosesRequest = axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );

        // wait for the promises to resolve
        const [{ data: patientListFromApi }, { data: diagnosisListFromApi }] =
          await Promise.all([patientsRequest, diagnosesRequest]);

        console.log("patientListFromApi :>> ", patientListFromApi);
        console.log(`diagnosisListFromApi`, diagnosisListFromApi);
        // update the react state
        dispatch(setPatientList(patientListFromApi));
        dispatch(setDiagnosisList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatientAndDiagnosisList();
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Container>
          <Header as="h1">Patientor</Header>
          <Button as={Link} to="/" primary>
            Home
          </Button>
          <Divider hidden />
          <Switch>
            <Route path="/" exact>
              <PatientListPage />
            </Route>
            <Route path="/patients/:id" exact>
              <PatientDetailPage />
            </Route>
          </Switch>
        </Container>
      </Router>
    </div>
  );
};

export default App;
