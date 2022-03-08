import { Button, Container, Form, Grid, GridColumn, Header, Image, Segment } from 'semantic-ui-react';
import { Field, Form as FinalForm } from "react-final-form";
import { Fragment, useContext, useState } from 'react'
import { combineValidators, composeValidators, isRequired, matchesField } from 'revalidate';

import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { FORM_ERROR } from 'final-form';
import LoginForm from './LoginForm';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import { TextInputIcons } from '../../app/common/form/TextInputIcons';
import queryString from "query-string";
import { styles } from "../../app/layout/FullScreenCardStyle";

const validate = combineValidators({
    password: isRequired({ message: "Potrebno je uneti vašu lozinku" }),
    passwordConfirm: composeValidators(
        isRequired({ message: "Potrebno je ponovo uneti vašu lozinku" }),
        matchesField('password','Lozinka')({
          message: "Potrebno je ponovo uneti vašu lozinku",
        })
      )()
  });

export const ChangePasswordForm: React.FC<RouteComponentProps> = ({ location }) => {

    const { token, email } = queryString.parse(location.search);
    const [status, SetStatus] = useState(false);

    const rootStore = useContext(RootStoreContext);
    const { openModal } = rootStore.modalStore;
    const { verifyPasswordRecovery } = rootStore.userStore;

    const getBody = () => {
      return (
        <div className="center">
          <FinalForm
            onSubmit={(values) =>
              verifyPasswordRecovery(token as string, email as string, values.password)
                .then(() => SetStatus(true))
                .catch((error) => ({
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
                  content="Unesite nove podatke"
                  color="teal"
                  textAlign="center"
                />
                <Field
                  name="password"
                  type="password"
                  labelName="Nova Lozinka"
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
                  disabled={(invalid && !dirtySinceLastSubmit) || pristine || status}
                  loading={submitting}
                  color="teal"
                  content="Potvrdi"
                  fluid
                />
                {status && (
                  <Fragment>
                    <p style={{ ...styles.TextStyle, marginBottom: "40px" }}>
                      Vaša Izmena lozinke je uspešna,
                      <br /> možete da se prijavite.
                    </p>
                    <Button
                      style={styles.ButtonStyle}
                      onClick={() => openModal(<LoginForm />)}
                      size="medium"
                      content="Prijavi se"
                      type="button"
                    ></Button>
                  </Fragment>
                )}
              </Form>
            )}
          />
        </div>
      );
    };

    return (
        <Container>
        <Grid style={styles.GridStyle} verticalAlign="middle" centered>
          <GridColumn mobile={14} style={styles.ColumnStyle} textAlign="center">
            <Image
              src="/assets/LogInEkvitiLogo.png"
              style={styles.LogoStyle}
              centered
            />
            <br />
            <br />
            <Image
              src="/assets/KnightRegistration.png"
              centered
            />
            <br />
            <Header as="h2" content="Izmena lozinke"/>
            <Segment.Inline>{getBody()}</Segment.Inline>
          </GridColumn>
        </Grid>
      </Container>
    );
}
