import { FORM_ERROR } from 'final-form'
import React, { useContext } from 'react'
import {Form as FinalForm, Field} from 'react-final-form'
import { combineValidators, isRequired } from 'revalidate'
import { Button, Form, Header } from 'semantic-ui-react'
import { ErrorMessage } from '../../app/common/form/ErrorMessage'
import { TextInput } from '../../app/common/form/TextInput'
import { IUserFormValues } from '../../app/models/user'
import { RootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
  email: isRequired({ message: 'Email adresa je neophodna'}),
  password: isRequired({ message: 'Šifra je neophodna'}),
  username: isRequired({ message: 'Korisničko ime je neophodno'})
})

export const RegisterForm = () => {
    const rootStore  = useContext(RootStoreContext);
    const { register } = rootStore.userStore;
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
          <Form onSubmit={handleSubmit} error>
            <Header
              as="h2"
              content="Dobrodošli"
              color="teal"
              textAlign="center"
            />
            <Field
              name="username"
              component={TextInput}
              placeholder="Korisničko ime"
            />
            <Field name="email" component={TextInput} placeholder="Email adresa" />
            <Field
              name="password"
              component={TextInput}
              placeholder="Šifra"
              type="password"
            />
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
