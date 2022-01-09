import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField } from "../AddPatientModal/FormField";
import { OccupationalHealthCareEntry, Patient } from "../types";
import { updatePatient, useStateValue } from "../state";
import { DiagnosisSelection } from "../AddPatientModal/FormField";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiBaseUrl } from "../constants";

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */

const OccupationalHealthCareEntryForm = ({
  onCancel,
}: {
  onCancel: () => void;
}) => {
  const [{ diagnoses }, dispatch] = useStateValue();

  const { id } = useParams<{ id: string }>();

  const submitOccupationalHealthCareEntry = async (
    values: Omit<OccupationalHealthCareEntry, "id">
  ) => {
    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(updatePatient(updatedPatient));
      onCancel();
    } catch (err) {
      console.log(`error submit operational health care entry`, err);
    }
  };

  return (
    <Formik
      initialValues={{
        type: "OccupationalHealthcare",
        description: "",
        date: "",
        specialist: "",
        employerName: "",
        sickLeave: { startDate: "", endDate: "" },
      }}
      onSubmit={submitOccupationalHealthCareEntry}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.sickLeave?.startDate) {
          errors.dischargeDate = requiredError;
        }
        if (!values.sickLeave?.endDate) {
          errors.dischargeCriteria = requiredError;
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date of Entry"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <Field
              label="Employer Name"
              placeholder="Name"
              name="employerName"
              component={TextField}
            />
            <Field
              label="Sickleave Start Date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label="Sickleave End Date"
              placeholder="YYYY-MM-DD"
              name="sickLeave.endDate"
              component={TextField}
            />

            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default OccupationalHealthCareEntryForm;
