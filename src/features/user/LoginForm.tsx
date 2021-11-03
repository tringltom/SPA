import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { Fragment, useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Button, Divider, Form, Header, Image } from "semantic-ui-react";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextInputIcons } from "../../app/common/form/TextInputIcons";
import { EkvitiColors } from "../../app/layout/EkvitiColors";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { RegisterForm } from "./RegisterForm";
import SocialLoginFacebook from "./SocialLoginFacebook";
import SocialLoginInstagram from "./SocialLoginInstagram";

const validate = combineValidators({
  email: isRequired({ message: "Email adresa je neophodna" }),
  password: isRequired({ message: "Lozinka je neophodna" }),
});

const ancorStyle = {
  cursor: "pointer", paddingLeft: 5, textDecoration: "underline"
}

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
            size="small"
            centered
            verticalAlign="middle"
            src="/assets/LogInEkvitiLogo.png"
          ></Image>
          <Header
            size="medium"
            as="h2"
            content="Dobrodošli nazad."
            color="black"
            textAlign="center"
            className="ekvitiPrimaryFont"
          />

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
            <div style={{ fontSize: 11, marginBottom: 20, marginTop: 5}}>
              <div style={{ float:"left", marginLeft: 5}}>
              <Field
                    name="stayLoggedIn"
                    component="input"
                    type="checkbox"
                    style={{widht: 90}}
                  />
                  <label className="ekvitiPrimaryFont" style={{ marginLeft: 5 }}>
                    Zapamti me
                  </label>
              </div>
              <div style={{ marginLeft: 90, textAlign: "right" }}>
                <p
                  className="ekvitiPrimaryFont"
                  style={{ fontSize: 11, display: "inline" }}
                >
                  Zaboravljena lozinka?
                  {/*eslint-disable-next-line*/}
                  <a
                    style={ancorStyle}
                    onClick={() => openModal(<ForgotPasswordForm />)}
                  >
                    Resetuj je
                  </a>
                </p>
              </div>
            </div>

            <Button
              className="ekvitiPrimaryFont"
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              content="Prijavi se"
              fluid
              style={{ backgroundColor: EkvitiColors.primary, color: "white" }}
            />
          </Form>
          <Divider horizontal>ili</Divider>
          <SocialLoginFacebook loading={loading} fbCallback={fbLogin} />
          <div style={{ padding: "5px" }} />
          <SocialLoginInstagram loading={loading} fbCallback={fbLogin} />

          <div style={{ textAlign: "center", paddingTop: "10px" }}>
            <p
              className="ekvitiPrimaryFont"
              style={{ fontSize: 11, display: "inline" }}
            >
              Nemaš nalog?
              {/*eslint-disable-next-line*/}
              <a style={ancorStyle} onClick={() => openModal(<RegisterForm />)}>
                Registracija
              </a>
            </p>
          </div>
        </Fragment>
      )}
    />
  );
};

export default observer(LoginForm);
