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
      message: "Za vic je dozvoljeno maksimalno 250 karaktera",
    })
  )(),
});

const JokeForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { create } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  return (
    <FinalForm
      onSubmit={(values: IActivityFormValues) =>
        openModal(
          <ModalYesNo
            handleConfirmation={() => create(values)}
            content="Novi vic"
            icon="smile outline"
          />,
          false
        )
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
          <Field hidden name="type" component="input" initialValue={2} />
          <Header as="h2" content="Vic" color="teal" textAlign="center" />
          <Field name="title" component={TextInput} placeholder="Naziv" />
          <Divider horizontal>Priložite sliku ili napišite vic</Divider>
          <Field name="image" component={FileInput} />
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Vic (nije potreban ukoliko priložite sliku)"
          />

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

export default observer(JokeForm);