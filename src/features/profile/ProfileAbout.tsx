import { Fragment, useContext, useState } from 'react'
import { Button, Container, Form, Header } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { Form as FinalForm, Field } from "react-final-form";
import { TextAreaInput } from '../../app/common/form/TextAreaInput';
import { combineValidators, hasLengthLessThan } from 'revalidate';
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { IUser } from '../../app/models/user';

const validate = combineValidators({about: hasLengthLessThan(2000)({message: 'Za opis je dozvoljeno maksimalno 2000 karaktera'})});

export const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;
  const { setUserAbout } = rootStore.profileStore;
  const { openModal } = rootStore.modalStore;

  const [edit, setEdit] = useState(false);

  return (
    <Container>
      <Header as="h2" textAlign="center" content="O Korisniku" />
      {!edit && 
        <Fragment>
          <p style={{textAlign:"justify"}}>{user?.about}</p>
          <Button
            floated="right"
            content="Izmeni"
            color="blue"
            onClick={() => setEdit(true)}
          />
        </Fragment>
      }
      {edit && (
        <FinalForm
          validate={validate}
          initialValues={user}
          onSubmit={(values : IUser) => {
            openModal(
              <ModalYesNo
                handleConfirmation={() =>
                  setUserAbout(values.about).then(() => setEdit(false))
                }
                content="O korisniku"
                icon="book"
              />
            );
          }}
          render={({ handleSubmit, invalid, pristine, submitting }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                name="about"
                rows={20}
                value={user?.about}
                component={TextAreaInput}
              />
              <Button
                loading={submitting}
                disabled={submitting || invalid || pristine}
                floated="right"
                positive
                type="submit"
                content="Potvrdi"
              />
              <Button
                floated="right"
                color="red"
                type="button"
                content="Odustani"
                onClick={() => setEdit(false)}
              />
            </Form>
          )}
        />
      )}
    </Container>
  );
}
