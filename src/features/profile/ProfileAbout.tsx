import { Button, Form, Header, Segment } from 'semantic-ui-react'
import { Field, Form as FinalForm } from "react-final-form";
import { Fragment, useContext, useState } from 'react'
import { combineValidators, hasLengthLessThan } from 'revalidate';

import { IUser } from '../../app/models/user';
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';
import { TextAreaInput } from '../../app/common/form/TextAreaInput';


const validate = combineValidators({about: hasLengthLessThan(2000)({message: 'Za opis je dozvoljeno maksimalno 2000 karaktera'})});

export const ProfileAbout = () => {
  const rootStore = useContext(RootStoreContext);
  const { userProfile, isProfileOwner } = rootStore.userStore;
  const { setUserAbout } = rootStore.profileStore;
  const { openModal } = rootStore.modalStore;
  const [edit, setEdit] = useState(false);
  

  return (
    <Segment clearing>
      <Header as="h2" textAlign="center" content="O Korisniku" />
      {!edit && isProfileOwner && (
        <Fragment>
          <p style={{ textAlign: "justify" }}>{userProfile?.about}</p>
          <Button
            floated="right"
            content="Izmeni"
            color="blue"
            onClick={() => setEdit(true)}
          />
        </Fragment>
      )}
      {edit && isProfileOwner && (
        <FinalForm
          validate={validate}
          initialValues={userProfile}
          onSubmit={(values: IUser) => {
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
                value={userProfile?.about}
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
    </Segment>
  );
};
