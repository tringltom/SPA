import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, composeValidators, createValidator, hasLengthLessThan, isRequired, isRequiredIf } from "revalidate";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import ModalYesNo from "../../app/common/modals/ModalYesNo";
import { ActivityTypes, IActivityFormValues } from "../../app/models/activity";
import { RootStoreContext } from "../../app/stores/rootStore";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { FileInput } from "../../app/common/form/FileInput";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import DateInput from "../../app/common/form/DateInput";
import { combineDateAndTime } from "../../app/common/form/utils/util";
import get from 'lodash/get';
import { MapWithSearchInput } from "../../app/common/form/MapWithSearchInput";

const isDateGreater = (otherField: string)  => createValidator(
  message => (value: any, allValues: any) => {

    const otherValue = get(allValues, otherField)?.toISOString().split('T')[0];
    const dateEndValue = value?.toISOString().split('T')[0];

    if (!allValues || dateEndValue < otherValue) {
      return message;
    }
  },
  field => ''
);

const isTimeGreater = (otherField: string)  => createValidator(
  message => (value: any, allValues: any) => {

    const otherValue = get(allValues, otherField);
    const dateEndValue = get(allValues, 'dateEnd')?.toISOString().split('T')[0];
    const dateStartValue = get(allValues, 'dateStart')?.toISOString().split('T')[0];

    if (!allValues || (value < otherValue && dateEndValue === dateStartValue)) {
      return message;
    }
  },
  field => ''
);

const validate = combineValidators({
  title: composeValidators(
    isRequired({ message: "Naziv je neophodan" }),
    hasLengthLessThan(50)({
      message: "Za naziv je dozvoljeno maksimalno 50 karaktera",
    })
  )(),
  description: composeValidators(
    isRequiredIf()((values: { image: any; }) => values && !values.image)({message: "Opis je obavezan ukoliko niste priložili sliku" }),
    hasLengthLessThan(250)({
      message: "Za opis je dozvoljeno maksimalno 250 karaktera",
    })
  )(),
  dateStart: isRequiredIf()((values: { timeStart: any, dateEnd: any, timeEnd: any}) => values && (values.timeStart || values.timeEnd || values.dateEnd))
    ({message: "Datum početka izazova je potreban ukoliko je definisano vreme početka i/ili datum i vreme kraja istog"}),
  timeStart: isRequiredIf()((values: { dateStart: any, dateEnd: any, timeEnd: any}) => values && (values.dateStart || values.timeEnd || values.dateEnd))
    ({message: "Vreme početka izazova je potrebno ukoliko je definisan datum početka i/ili datum i vreme kraja istog"}),
  dateEnd: composeValidators(
    isDateGreater('dateStart')({message : "Datum završetka izazova mora biti nakon datuma početka istog"}),
    isRequiredIf()((values: { timeEnd: any; }) => values && values.timeEnd)
      ({message: "Datum završetka izazova je potreban ukoliko je definisano vreme završetka istog" }))(), 
  timeEnd: composeValidators(
   isTimeGreater('timeStart')({message : "Vreme završetka izazova mora biti nakon vremena početka istog"}),
   isRequiredIf()((values: { dateEnd: any; }) => values && values.dateEnd)
      ({message: "Vreme završetka izazova je potrebno ukoliko je definisan datum završetka istog" }))()
});

const ChallengeForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { create } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  const [submitError, setsubmitError] = useState(null);

  const normaliseValues = (values: IActivityFormValues) => {
    if (values.coords) {
      values.latitude = values.coords?.lat;
      values.longitude = values.coords?.lng;
      values.location = values.coords?.location;
    }
    if (values.dateStart && values.timeStart) {
      values.startDate = combineDateAndTime(values.dateStart, values.timeStart);
    }
    if (values.dateEnd && values.timeEnd) {
      values.endDate = combineDateAndTime(values.dateEnd, values.timeEnd);
    }
    delete values.coords;
    delete values.dateStart;
    delete values.timeStart;
    delete values.dateEnd;
    delete values.timeEnd;
  };

  return (
    <FinalForm
      onSubmit={(values: IActivityFormValues) => {
        setsubmitError(null);
        openModal(
          <ModalYesNo
            handleConfirmation={() => (
              // eslint-disable-next-line
              normaliseValues(values),
              create(values).catch((error) => setsubmitError(error))
            )}
            content="Novi Izazov"
            icon="hand rock"
          />,
          false
        );
      }}
      validate={validate}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form autoComplete="off" onSubmit={handleSubmit} error>
          <Field hidden name="type" component="input" initialValue={ActivityTypes.Challenge} />
          <Header as="h2" content="Izazov" color="teal" textAlign="center" />
          <Field name="title" component={TextInput} placeholder="Naziv" />
          <Divider horizontal>Priložite sliku ili opišite izazov</Divider>
          <Field name="images" component={FileInput} />
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Opis (nije potreban ukoliko priložite sliku)"
          />
          <Divider horizontal>Lokacija izazova</Divider>
          <Field name="coords" component={MapWithSearchInput} />
          <Divider horizontal>Početak Izazova</Divider>
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
          <Divider horizontal>Kraj Izazova</Divider>
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
          <Divider horizontal></Divider>
          {submitError && <ErrorMessage error={submitError} />}
          <Button
            disabled={invalid || pristine}
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