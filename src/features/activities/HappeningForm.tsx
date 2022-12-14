import { ActivityTypes, IActivityFormValues } from "../../app/models/activity";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, composeValidators, createValidator, hasLengthLessThan, isRequired, isRequiredIf } from "revalidate";
import { useContext, useEffect, useState } from "react";

import DateInput from "../../app/common/form/DateInput";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { FileInput } from "../../app/common/form/FileInput";
import ModalYesNo from "../../app/common/modals/ModalYesNo";
import { RootStoreContext } from "../../app/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { TextInput } from "../../app/common/form/TextInput";
import { combineDateAndTime } from "../../app/common/form/utils/formUtil";
import get from 'lodash/get';
import { observer } from "mobx-react-lite";
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

const isCoordsRequired = ()  => createValidator(
  message => (allValues: any) => {

    const lng = get(allValues, 'lng');
    const lat = get(allValues, 'lat');
    const location = get(allValues, 'location');

    if (!allValues || (!lng || !lat || !location)) {
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
  coords: isCoordsRequired()({ message: "Lokacija je neophodna za kreiranje doga??aja" }),
  description: composeValidators(
    isRequiredIf()((values: { images: any }) => values && !values.images)({
      message: "Opis je obavezan ukoliko niste prilo??ili sliku",
    }),
    hasLengthLessThan(250)({
      message: "Za opis doga??aja je dozvoljeno maksimalno 250 karaktera",
    })
  )(),
  dateStart: isRequiredIf()((values: { timeStart: any, dateEnd: any, timeEnd: any}) => values && (values.timeStart || values.timeEnd || values.dateEnd))
    ({message: "Datum po??etka doga??aja je potreban ukoliko je definisano vreme po??etka i/ili datum i vreme kraja istog"}),
  timeStart: isRequiredIf()((values: { dateStart: any, dateEnd: any, timeEnd: any}) => values && (values.dateStart || values.timeEnd || values.dateEnd))
    ({message: "Vreme po??etka doga??aja je potrebno ukoliko je definisan datum po??etka i/ili datum i vreme kraja istog"}),
  dateEnd: composeValidators(
    isDateGreater('dateStart')({message : "Datum zavr??etka doga??aja mora biti nakon datuma po??etka istog"}),
    isRequiredIf()((values: { timeEnd: any; }) => values && values.timeEnd)
      ({message: "Datum zavr??etka doga??aja je potreban ukoliko je definisano vreme zavr??etka istog" }))(), 
  timeEnd: composeValidators(
   isTimeGreater('timeStart')({message : "Vreme zavr??etka doga??aja mora biti nakon vremena po??etka istog"}),
   isRequiredIf()((values: { dateEnd: any; }) => values && values.dateEnd)
      ({message: "Vreme zavr??etka doga??aja je potrebno ukoliko je definisan datum zavr??etka istog" }))()
});

interface DetailParams {
  id: string;
}

const HappeningForm : React.FC<RouteComponentProps<DetailParams>>= ({match}) => {
  const activityId = match.params.id;

  const rootStore = useContext(RootStoreContext);
  const { create, update, getOwnerPendingActivity, resetPendingActivity, pendingActivity } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  const [submitError, setsubmitError] = useState(null);

  useEffect(() => {
    if (activityId)
      getOwnerPendingActivity(activityId);
    else
      resetPendingActivity();
    return () => resetPendingActivity();      
  }, [activityId, getOwnerPendingActivity, resetPendingActivity]);

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
  };

  return (
    <FinalForm
      initialValues={pendingActivity ?? {}}
      onSubmit={(values: IActivityFormValues) => {
        setsubmitError(null);
        openModal(
          <ModalYesNo
            handleConfirmation={() => (
              // eslint-disable-next-line
              normaliseValues(values),
              activityId ? update(activityId, values).catch((error) => setsubmitError(error)) : create(values).catch((error) => setsubmitError(error))
            )}
            content="Novi doga??aj"
            icon="address card outline"
          />,
          false
        );
      }}
      validate={validate}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form autoComplete="off" onSubmit={handleSubmit} error>
          <Field hidden name="type" component="input" initialValue={ActivityTypes.Happening} />
          <Header as="h2" content="Doga??aj" color="teal" textAlign="center" />
          <Field name="title" component={TextInput} placeholder="Naziv" />
          <Divider horizontal>Prilo??ite sliku ili opi??ite doga??aj</Divider>
          <Field name="images" component={FileInput} state={activityId}/>
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Opis doga??aja (nije potreban ukoliko prilo??ite sliku)"
          />
          <Divider horizontal>Lokacija doga??aja</Divider>
          <Field name="coords" component={MapWithSearchInput} />
          <Divider horizontal>Po??etak doga??aja</Divider>
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
          <Divider horizontal>Kraj doga??aja</Divider>
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
            content={activityId ? "Izmeni" : "Kreiraj"}
            fluid
          />
        </Form>
      )}
    />
  );
};

export default observer(HappeningForm);