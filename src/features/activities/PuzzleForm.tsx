import { ActivityTypes, IActivityFormValues } from "../../app/models/activity";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired, isRequiredIf } from "revalidate";
import { useContext, useState } from "react";

import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { FileInput } from "../../app/common/form/FileInput";
import ModalYesNo from "../../app/common/modals/ModalYesNo";
import { RootStoreContext } from "../../app/stores/rootStore";
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
  answer: composeValidators(
    isRequired({ message: "Odgovor je neophodan" }),
    hasLengthLessThan(100)({
      message: "Za odgovor je dozvoljeno maksimalno 100 karaktera",
    })
  )(),
  description: composeValidators(
    isRequiredIf()((values: { images: any; }) => values && !values.images)({message: 'Opis je obavezan ukoliko niste priložili sliku' }),
    hasLengthLessThan(250)({
      message: "Za opis je dozvoljeno maksimalno 250 karaktera",
    })
  )(),
});

const PuzzleForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { create } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  const [submitError, setsubmitError] = useState(null);

  return (
    <FinalForm
      onSubmit={(values: IActivityFormValues) => {
        setsubmitError(null);
        openModal(
          <ModalYesNo
            handleConfirmation={() =>
              create(values).catch((error) => setsubmitError(error))
            }
            content="Nova Zagonetka"
            icon="puzzle piece"
          />,
          false
        );
      }}
      validate={validate}
      render={({ handleSubmit, invalid, pristine }) => (
        <Form autoComplete="off" onSubmit={handleSubmit} error>
          <Field hidden name="type" component="input" initialValue={ActivityTypes.Puzzle} />
          <Header as="h2" content="Zagonetka" color="teal" textAlign="center" />
          <Field name="title" component={TextInput} placeholder="Naziv" />
          <Divider horizontal>Priložite sliku ili opišite zagonetku</Divider>
          <Field name="images" component={FileInput} />
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Opis (nije potreban ukoliko priložite sliku)"
          />
          <Divider horizontal></Divider>
          <Field name="answer" component={TextInput} placeholder="Odgovor" />
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

export default observer(PuzzleForm);