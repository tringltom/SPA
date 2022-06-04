import { Button, Container, Form } from 'semantic-ui-react';
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired, isRequiredIf } from 'revalidate';

import { FileInput } from '../../app/common/form/FileInput';
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';
import { TextAreaInput } from '../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

const validate = combineValidators({
    description: composeValidators(
        isRequiredIf()((values: { images: any; }) => values && !values.images)({message: "Opis je obavezan ukoliko niste priložili sliku" }),
        hasLengthLessThan(250)({
          message: "Za opis je dozvoljeno maksimalno 250 karaktera",
        })
      )()
  });

export const ChallengeAnswerForm : React.FC<{activityId: string}> = ({activityId})  => {
  const rootStore = useContext(RootStoreContext);
  const { answerChallenge, submitting } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  return (
    <Container>
      <FinalForm
        validate={validate}
        onSubmit={(values) => {
            openModal(
                <ModalYesNo
                  handleConfirmation={() =>
                    answerChallenge(values)
                  }
                  content="Odogovor na Izazov"
                  icon="hand peace"
                />,
                false
              );
        }}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form autoComplete="off" onSubmit={handleSubmit} error>
            <Field
              hidden
              name="id"
              component="input"
              initialValue={activityId}
            />
            <Field  name="description"
            component={TextAreaInput}
            placeholder="Opis (nije potreban ukoliko priložite sliku)"/>
            <Field name="images" component={FileInput} state={activityId} />
            <Button
              loading={submitting}
              disabled={submitting || invalid || pristine}
              color="teal"
              content="Potvrdi"
              type="submit"
              fluid
            />
          </Form>
        )}
      />
    </Container>
  );
}
  
export default observer(ChallengeAnswerForm);
