import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired, isRequiredIf } from "revalidate";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import ModalYesNo from "../../app/common/modals/ModalYesNo";
import { IActivityFormValues } from "../../app/models/activity";
import { RootStoreContext } from "../../app/stores/rootStore";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { FileInput } from "../../app/common/form/FileInput";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { MapInput } from "../../app/common/form/MapInput";
import { DateTimeRangePickerInput } from "../../app/common/form/DateTimeRangePickerInput";

const validate = combineValidators({
  title: composeValidators(
    isRequired({ message: "Naziv je neophodan" }),
    hasLengthLessThan(50)({
      message: "Za naziv je dozvoljeno maksimalno 50 karaktera",
    })
  )(),
  description: composeValidators(
    isRequiredIf()((values: { image: any; }) => values && !values.image)({message: 'Opis je obavezan ukoliko niste priložili sliku' }),
    hasLengthLessThan(250)({
      message: "Za opis je dozvoljeno maksimalno 250 karaktera",
    })
  )(),
});

const ChallengeForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { create } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  const normaliseValues = (values: IActivityFormValues) => 
  {
    if(values.coords) 
    {
      values.latitude = values.coords?.lat;
      values.longitude = values.coords?.lng;
      values.location = values.coords?.location;
    }
    delete values.coords;
    delete values.dates;
  }

const handleSubmit = (values: IActivityFormValues) =>(
        values.startDate = (values.dates[0]).toUTCString(),
        values.endDate = (values.dates[1]).toUTCString(),
        openModal(
          <ModalYesNo
            handleConfirmation={
              () => (
                normaliseValues(values),
                create(values))}
            content="Novi Izazov"
            icon="hand rock"
          />, false
        ));

  return (
    <FinalForm
      onSubmit={handleSubmit}
      validate={validate}
      render={({
        handleSubmit,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form autoComplete="off" onSubmit={handleSubmit} error>
          <Field hidden name="type" component='input' initialValue={6}/>
          <Header as="h2" content="Izazov" color="teal" textAlign="center" />
          <Field name="title" component={TextInput} placeholder="Naziv" />
          <Divider horizontal>Priložite sliku ili opišite izazov</Divider>
          <Field name="image" component={FileInput}/>
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Opis (nije potreban ukoliko priložite sliku)"
          />
          <Form.Group>
            <Field name="coords" component={MapInput}/>
            <Field name="dates" component={DateTimeRangePickerInput} />
          </Form.Group>
          <Divider horizontal></Divider>
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            color="teal"
            content="Kreiraj"
            fluid
          />
        </Form>
      )}
    />
  );
};

export default observer(ChallengeForm);