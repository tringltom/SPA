import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Button, Divider, Form, Header } from "semantic-ui-react";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextInput } from "../../app/common/form/TextInput";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import SocialLoginFacebook from "./SocialLoginFacebook";
import SocialLoginInstagram from "./SocialLoginInstagram";

const validate = combineValidators({
  email: isRequired({ message: "Email adresa je neophodna" }),
  password: isRequired({ message: "Šifra je neophodna" }),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, fbLogin, loading } = rootStore.userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
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
            content="Dobrodošli"
            color="teal"
            textAlign="center"
          />
          <Field
            name="email"
            component={TextInput}
            placeholder="Email adresa"
          />
          <Field
            name="password"
            type="password"
            component={TextInput}
            placeholder="Šifra"
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
          <Divider horizontal>Ili</Divider>
          <SocialLoginFacebook loading={loading} fbCallback={fbLogin} />
          <SocialLoginInstagram loading={loading} fbCallback={fbLogin} />
          {/* TO DO*/}
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
