import { Button, Form, Header } from "semantic-ui-react";
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, isRequired } from "revalidate";

import { EkvitiColors } from "../../app/layout/EkvitiColors";
import { ErrorMessage } from "../../app/common/form/ErrorMessage";
import { FORM_ERROR } from "final-form";
import { RootStoreContext } from "../../app/stores/rootStore";
import { TextInputIcons } from "../../app/common/form/TextInputIcons";
import { observer } from "mobx-react-lite";
import { useContext } from "react";

const validate = combineValidators({
  email: isRequired({ message: "Email adresa je neophodna" }),
});

const ButtonStyle = {
  backgroundColor: EkvitiColors.primary,
  color: "white",
  height: "50px",
  borderRadius: "7px"
};

export const ForgotPasswordForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { recoverPassword } = rootStore.userStore;
  return (
    <FinalForm
      onSubmit={(values: any) =>
        recoverPassword(values.email).catch((error) => ({
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
            content="Izmena lozinke"
            style={{color: EkvitiColors.primary}}
            textAlign="center"
          />
          <Field
            name="email"
            component={TextInputIcons}
            labelName="E-mail"
            placeholder="Email adresa"
            iconName="envelope"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage error={submitError} />
          )}
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            style={ButtonStyle}
            content="Potvrdi"
            fluid
          />
        </Form>
      )}
    />
  );
};

export default observer(ForgotPasswordForm);
