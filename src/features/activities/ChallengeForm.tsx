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
import DateInput from "../../app/common/form/DateInput";
import { combineDateAndTime } from "../../app/common/form/utils/util";
import { ValidationErrors } from "final-form";

const validateDates = (values: IActivityFormValues): ValidationErrors =>{
  if(!values.endDate || 
    values.dateEnd > values.dateStart! ||
    values.dateEnd === values.dateStart! && values.endTime! > values.startTime!)
  {
    return undefined;
  }
  return ['Krajnji datum mora biti veci nego pocetni']
};

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
  )()
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
    delete values.dateStart;
    delete values.timeStart;
    delete values.dateEnd;
    delete values.timeStart;
  }

  return (
    <FinalForm
      onSubmit= {(values: IActivityFormValues) =>(
        values.startDate = combineDateAndTime(values.dateStart, values.timeStart),
        values.endDate = combineDateAndTime(values.dateEnd, values.timeStart),
        openModal(
          <ModalYesNo
            handleConfirmation={
              () => (
                normaliseValues(values),
                create(values))}
            content="Novi Izazov"
            icon="hand rock"
          />, false
        ))
      }
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
            <Field name="coords" component={MapInput}/>
            <Form.Group>
                   <Field
                     name="dateStart"
                     placeholder="Datum"
                     component={DateInput}
                     date={true}
                     />
                   <Field
                     name="timeStart"
                     placeholder="Vreme"
                     time={true}
                     component={DateInput}
                     />
              </Form.Group>
              <Divider horizontal>Početak Izazova</Divider>
              <Form.Group>
                   <Field
                     name="dateEnd"
                     placeholder="Datum"
                     component={DateInput}
                     date={true}
                     />
                   <Field
                     name="timeEnd"
                     placeholder="Vreme"
                     time={true}
                     component={DateInput}
                     />
                </Form.Group>
              <Divider horizontal>Kraj Izazova</Divider>
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