import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { Fragment, useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";
import { Button, Checkbox, Divider, Form, Header, Icon, Image, Label } from "semantic-ui-react";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { TextInput } from "../../app/common/form/TextInput";
import { EkvitiColors } from "../../app/layout/EkvitiColors";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { RegisterForm } from "./RegisterForm";
import SocialLoginFacebook from "./SocialLoginFacebook";
import SocialLoginInstagram from "./SocialLoginInstagram";

const validate = combineValidators({
  email: isRequired({ message: "Email adresa je neophodna" }),
  password: isRequired({ message: "Šifra je neophodna" }),
});

const ancorStyle = {
  cursor: "pointer", paddingLeft: "5px", textDecoration: "underline"
}

const labelStyle = {
  position: "absolute", left: "21px", top: "1px", background: 'transparent', color: EkvitiColors.primary
}

const iconStyle = {
  position: "absolute", left: "5px", top: "15px"
}

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, fbLogin, loading } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
  require("../../app/layout/loginStyles.css");
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
          <Image size="small" centered verticalAlign="middle" src="/assets/Ekviti_Logo_Log_In.png"></Image>
          <Header
            size = "medium"
            as="h2"
            content="Dobrodošli nazad."
            color="black"
            textAlign="center"
            className="ekvitiPrimaryFont"
          />
        
        <Form autoComplete="off" onSubmit={handleSubmit} error>
          <div style={{paddingBottom: "10px"}}>
          <Label className="ekvitiPrimaryFont" style={labelStyle}>E-mail</Label>
          <Icon name="envelope" style={iconStyle}/>
          <Field 
           name="email"
           component={TextInput}
           />
           </div>
           <div style={{position: "relative", paddingBottom: "10px"}}>
           <Label className="ekvitiPrimaryFont" style={labelStyle}>Lozinka</Label>
          <Icon name="lock" style={iconStyle}/>
          <Field
            name="password"
            type="password"
            component={TextInput}
          />
          </div>
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}

          <div>
              <Form.Field style={{ float: "left", widht: "90px"}}>
                <Checkbox className="ekvitiPrimaryFont" label="Zapamti me" style={{fontSize: 11}}/>
              </Form.Field>
              <div style={{marginLeft: "90px", textAlign: "right"}}>
                <p className="ekvitiPrimaryFont" style={{fontSize: 11, display: "inline"}}>Zaboravljena lozinka?
                  <a style={ancorStyle} onClick={() => openModal(<ForgotPasswordForm />)}>Resetuj je</a>
                </p>
              </div>
          </div>

          <Button
            className = "ekvitiPrimaryFont"
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            content="Prijavi se"
            fluid
            style={{ backgroundColor: EkvitiColors.primary, color: "white"}}
          />
        </Form>
        <Divider horizontal>ili</Divider>
        <SocialLoginFacebook loading={loading} fbCallback={fbLogin} />
        <div style={{padding: "5px"}}/>
        <SocialLoginInstagram loading={loading} fbCallback={fbLogin} />
        
        <div style={{textAlign: "center", paddingTop: "10px"}}>
                <p className="ekvitiPrimaryFont" style={{fontSize: 11, display: "inline"}}>Nemaš nalog?
                  <a style={ancorStyle} onClick={() => openModal(<RegisterForm />)}>Registracija</a>
                </p>
        </div>

        </Fragment>
      )}
    />
  );
};

export default observer(LoginForm);
