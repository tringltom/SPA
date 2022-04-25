import { ActivityTypes, IActivityFormValues } from "../../app/models/activity";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired } from "revalidate";
import { useContext, useEffect, useState } from "react";

import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { FileInput } from "../../app/common/form/FileInput";
import ModalYesNo from "../../app/common/modals/ModalYesNo";
import { RootStoreContext } from "../../app/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { TextInput } from "../../app/common/form/TextInput";
import { observer } from "mobx-react-lite";

const validate = combineValidators({
  title: composeValidators(
    isRequired({ message: "Naziv je neophodan" }),
    hasLengthLessThan(50)({
      message: "Za naziv je dozvoljeno maksimalno 50 karaktera",
    })
  )(),
  description: composeValidators(
    isRequired({ message: "Opis je neophodan" }),
    hasLengthLessThan(250)({
      message: "Za opis je dozvoljeno maksimalno 250 karaktera",
    })
  )(),
  images: isRequired({ message: "Slika je neophodna" })
});

interface DetailParams {
  id: string;
}

const GoodDeedForm : React.FC<RouteComponentProps<DetailParams>>= ({match}) => {
  const activityId = match.params.id;

  const rootStore = useContext(RootStoreContext);
  const { create, update, getOwnerPendingActivity, resetPendingActivitiy, pendingActivity } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  const [submitError, setsubmitError] = useState(null);

  useEffect(() => {
    if (activityId)
      getOwnerPendingActivity(activityId);
    else
      resetPendingActivitiy();
    return () => resetPendingActivitiy();
  }, [activityId, getOwnerPendingActivity, resetPendingActivitiy]);

  const normaliseValues = (values: IActivityFormValues) => {
    if (values.coords) {
      values.latitude = values.coords?.lat;
      values.longitude = values.coords?.lng;
      values.location = values.coords?.location;
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
            content="Novo Dobro Delo"
            icon="heartbeat"
          />,
          false
        );
      }}
      validate={validate}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form autoComplete="off" onSubmit={handleSubmit} error>
          <Field hidden name="type" component="input" initialValue={ActivityTypes.GoodDeed} />
          <Header
            as="h2"
            content="Dobro Delo"
            color="teal"
            textAlign="center"
          />
          <Field name="title" component={TextInput} placeholder="Naziv" />
          <Divider horizontal>
            Priložite do 3 slike i opišite dobro delo
          </Divider>
          <Field name="images" component={FileInput} maxNumberofFiles={3} state={activityId} />
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Opis"
          />
          <Divider horizontal>Lokacija dobrog dela</Divider>
          {/* <Field name="coords" component={MapWithSearchInput} /> */}
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

export default observer(GoodDeedForm);