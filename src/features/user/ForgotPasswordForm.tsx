import React, { useContext } from 'react'
import { combineValidators, isRequired } from 'revalidate'
import { IUserFormValues } from '../../app/models/user';
import {Form as FinalForm, Field} from 'react-final-form'
import { Button, Header, Form } from 'semantic-ui-react';
import { TextInput } from '../../app/common/form/TextInput';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { observer } from 'mobx-react-lite';
import { FORM_ERROR } from 'final-form';
import { RootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
  email: isRequired({ message: 'E-pošta je neophodna'})
})

export const ForgotPasswordForm = () => {
  const rootStore  = useContext(RootStoreContext);
  const { recoverPassword, loading} = rootStore.userStore;
  return (
    <FinalForm
      onSubmit={(email: string) =>
        recoverPassword(email).catch((error) => ({
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
          <Field name="email" component={TextInput} placeholder="Email adresa" />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
            />
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
}

export default observer(ForgotPasswordForm);
