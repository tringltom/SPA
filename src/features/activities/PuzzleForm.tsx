import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, composeValidators, hasLengthGreaterThan, hasLengthLessThan, isRequired } from "revalidate";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextInput } from "../../app/common/form/TextInput";
import ModalYesNo from "../../app/common/modals/ModalYesNo";
import { IActivityFormValues } from "../../app/models/activity";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoginForm from "../user/LoginForm";

const validate = combineValidators({
  title: composeValidators(
    isRequired({ message: "Naziv je neophodan" }),
    hasLengthLessThan(50)({ message: "Za naziv je dozvoljeno maksimalno 50 karaktera" })
  )(),
  answer: composeValidators(
    isRequired({ message: "Odgovor je neophodan" }),
    hasLengthLessThan(100)({ message: "Za odgovor je dozvoljeno maksimalno 100 karaktera" })
  )(),
  description : hasLengthLessThan(250)({ message: "Za opis je dozvoljeno maksimalno 250 karaktera" })
  /*user requiredif for new field for image and for description or only for desc to be required if image is null*/ 
});

const PuzzleForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { create } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;
  return (
    <FinalForm
      onSubmit={(values: IActivityFormValues) =>
        openModal(<ModalYesNo handleConfirmation={create} />)
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Zagonetka"
            color="teal"
            textAlign="center"
          />
          <Field
            name="title"
            component={TextInput}
            placeholder="Naziv"
          />
          <Divider horizontal>Priložite sliku ili opišite zagonetku</Divider>
          <Field
            name="description"
            component={TextInput}
            placeholder="Opis"
          />
          <Divider horizontal></Divider>
          <Field
            name="answer"
            component={TextInput}
            placeholder="Odgovor"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="teal"
            content="Potvrdi"
            fluid
          />
        </Form>
      )}
    />
  );
};

export default observer(PuzzleForm);
