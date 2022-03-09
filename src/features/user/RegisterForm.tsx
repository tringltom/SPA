import { FORM_ERROR } from "final-form";
import { Fragment, useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, composeValidators, isRequired, matchesField } from "revalidate";
import { Button, Container, Form, Header, Image } from "semantic-ui-react";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextInputIcons } from "../../app/common/form/TextInputIcons";
import { EkvitiColors } from "../../app/layout/EkvitiColors";
import { styles } from "../../app/layout/TextStyle";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoginForm from "./LoginForm";

const validate = combineValidators({
  email: isRequired({ message: "Potrebno je uneti vašu E-mail adresu" }),
  password: isRequired({ message: "Potrebno je uneti vašu lozinku" }),
  username: isRequired({ message: "Potrebno je uneti Korisničko ime" }),
  passwordConfirm: composeValidators(
    isRequired({ message: "Potrebno je ponovo uneti vašu lozinku" }),
    matchesField('password','Lozinka')({
      message: "Potrebno je ponovo uneti vašu lozinku",
    })
  )()
});

export const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { register } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
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
        <Fragment>
          <Form autoComplete="off" onSubmit={handleSubmit} error>
            <Image size="small" centered src="/assets/LogInEkvitiLogo.png" />
            <Header
              size="medium"
              content="Napravite novi nalog."
              textAlign="center"
              color="black"
            />

            <Field
              name="username"
              component={TextInputIcons}
              labelName="Korisničko ime"
              iconName="user"
            />
            <Field
              name="email"
              component={TextInputIcons}
              labelName="E-mail"
              iconName="envelope"
            />
            <Field
              name="password"
              type="password"
              labelName="Lozinka"
              iconName="lock"
              password={true}
              component={TextInputIcons}
            />
            <Field
              name="passwordConfirm"
              type="password"
              labelName="Ponovi lozinku"
              iconName="lock"
              password={true}
              component={TextInputIcons}
              
            />
            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage error={submitError} />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              content="Registruj se"
              fluid
              style={{
                backgroundColor: EkvitiColors.primary,
                color: "white",
                height: "50px",
                borderRadius: "7px"
              }}
            />
          </Form>
          <Container style={{ marginTop: "5px", textAlign:"center"}}>
            <p
              style={{ fontSize: 11, display: "inline" }}
            >
              Već imaš nalog?
              {/*eslint-disable-next-line*/}
              <a
                style={styles.Ancor}
                onClick={() => openModal(<LoginForm />)}
              >
                Prijava.
              </a>
            </p>
          </Container>
        </Fragment>
      )}
    />
  );
};
