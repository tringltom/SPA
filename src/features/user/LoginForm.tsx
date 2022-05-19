import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { Fragment, useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Container, Divider, Form, Header } from "semantic-ui-react";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextInputIcons } from "../../app/common/form/TextInputIcons";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { RegisterForm } from "./RegisterForm";
import SocialLoginFacebook from "./SocialLoginFacebook";
import SocialLoginInstagram from "./SocialLoginInstagram";
import { styles } from "../../app/layout/TextStyle";
import { CheckBoxInput } from "../../app/common/form/CheckBoxInput";
import { Button } from "../../app/components/Button";
import { Image } from "../../app/components/Image";
import { Typography } from "../../app/components/Typography";

const validate = combineValidators({
  email: isRequired({ message: "Potrebno je uneti E-mail adresu" }),
  password: isRequired({ message: "Potrebno je uneti lozinku" }),
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
        <Fragment>
          <Image 
          src="/assets/LogInEkvitiLogo.png"
          alt="Ekviti Logo"
          imageStyle="mx-auto pb-8"
          />

          <Typography
          variant={Typography.variant.h3}
          color={Typography.color.text}
          align={Typography.align.center}
          className="m-0 pb-12"          
          >
            Dobrodošli nazad
          </Typography>

          <Form autoComplete="off" onSubmit={handleSubmit} error>
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
            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage error={submitError} />
            )}
            <div style={{ fontSize: 11, marginBottom: 20, marginTop: 5 }}>
              <div style={{ float: "left", marginLeft: 0 }}>
                <Field
                  name="stayLoggedIn"
                  component={CheckBoxInput}
                  type="checkbox"
                  label="Zapamti me"
                />
              </div>
              <div style={{ marginLeft: 90, textAlign: "right" }}>
                <p
                  style={{ fontSize: 11, display: "inline" }}
                >
                  Zaboravljena lozinka?
                  {/*eslint-disable-next-line*/}
                  <a
                    style={styles.Ancor}
                    onClick={() => openModal(<ForgotPasswordForm />)}
                  >
                    Resetuj je
                  </a>
                </p>
              </div>
            </div>

            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}     
              size={Button.size.xs}         
              fullWidth
            >Prijavi se</Button>
          </Form>
          <Divider horizontal>
            <Header as="h4">ili</Header>
          </Divider>
          <SocialLoginFacebook loading={loading} fbCallback={fbLogin} />
          <div style={{ padding: "5px" }} />
          <SocialLoginInstagram loading={loading} igCallback={fbLogin} />

          <Container style={{ marginTop: "10px", textAlign: "center" }}>
            <p
              style={{ fontSize: 11, display: "inline" }}
            >
              Nemaš nalog?
              {/*eslint-disable-next-line*/}
              <a
                style={styles.Ancor}
                onClick={() => openModal(<RegisterForm />)}
              >
                Registracija.
              </a>
            </p>
          </Container>
        </Fragment>
      )}
    />
  );
};

export default observer(LoginForm);
