import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired } from "revalidate";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { TextInput } from "../../app/common/form/TextInput";
import ModalYesNo from "../../app/common/modals/ModalYesNo";
import { ActivityTypes, IActivityFormValues } from "../../app/models/activity";
import { RootStoreContext } from "../../app/stores/rootStore";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { FileInput } from "../../app/common/form/FileInput";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { MapWithSearchInput } from "../../app/common/form/MapWithSearchInput";


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

const GoodDeedForm = () => {
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
    delete values.coords;
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
          <Field name="images" component={FileInput} maxNumberofFiles={3} />
          <Divider horizontal></Divider>
          <Field
            name="description"
            component={TextAreaInput}
            placeholder="Opis"
          />
          <Divider horizontal>Lokacija dobrog dela</Divider>
          <Field name="coords" component={MapWithSearchInput} />
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

export default observer(GoodDeedForm);