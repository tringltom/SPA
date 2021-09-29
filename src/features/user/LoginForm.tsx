import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Button, Checkbox, Container, Divider, Form, Grid, Header, Image } from "semantic-ui-react";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextInput } from "../../app/common/form/TextInput";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import ForgotPasswordForm from "./ForgotPasswordForm";
import SocialLoginFacebook from "./SocialLoginFacebook";
import SocialLoginInstagram from "./SocialLoginInstagram";

const validate = combineValidators({
  email: isRequired({ message: "Email adresa je neophodna" }),
  password: isRequired({ message: "Šifra je neophodna" }),
});

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, fbLogin, loading } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
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
         <Container><Image verticalAlign='middle' src="/assets/Ekviti_Logo_Log_In.png"></Image></Container>
          <Header
            as="h2"
            content="Dobrodošli nazad."
            color="black"
            textAlign="center"
          ></Header>
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
          <Form.Group>
            <Form.Field>
              <Checkbox label="Zapamti me" />
            </Form.Field>
            <div className="ui message">
            Zaboravljena lozinka?  <a className="aHyperlinkText" onClick={() => openModal(<ForgotPasswordForm />)}>resetuj je</a>
            </div>
            
          </Form.Group>

          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color="blue"
            content="Prijavi se"
            fluid
          />
          <Divider horizontal>ili</Divider>
          <SocialLoginFacebook loading={loading} fbCallback={fbLogin} />
          <SocialLoginInstagram loading={loading} fbCallback={fbLogin} />
          {/* TO DO*/}
        </Form>
      )}
    />
  );
};

export default observer(LoginForm);
