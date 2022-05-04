import { ActivityTypes, IActivityFormValues } from "../../app/models/activity";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired, isRequiredIf } from "revalidate";
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
    isRequiredIf()((values: { images: any; }) => values && !values.images)({message: 'Opis je obavezan ukoliko niste priložili sliku' }),
    hasLengthLessThan(250)({
      message: "Za vic je dozvoljeno maksimalno 250 karaktera",
    })
  )(),
});

interface DetailParams {
  id: string;
}

const JokeForm : React.FC<RouteComponentProps<DetailParams>>= ({match}) => {
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

  return (
    <FinalForm
    initialValues={pendingActivity ?? {}}
      onSubmit={(values: IActivityFormValues) => {
        setsubmitError(null);
        openModal(
          <ModalYesNo
            handleConfirmation={() =>
              activityId ? update(activityId, values).catch((error) => setsubmitError(error)) : create(values).catch((error) => setsubmitError(error))
            }
            content="Novi vic"
            icon="smile outline"
          />,
          false
        );
      }}
      validate={validate}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form autoComplete="off" onSubmit={handleSubmit} error>
          <Field hidden name="type" component="input" initialValue={ActivityTypes.Joke} />
          <Header as="h2" content="Vic" color="teal" textAlign="center" />
          <Field name="title" component={TextInput} placeholder="Naziv" />
          <Divider horizontal>Priložite sliku ili napišite vic</Divider>
          <Field name="images" component={FileInput} state={activityId}/>
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Tekst (nije potreban ukoliko priložite sliku)"
          />
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

export default observer(JokeForm);