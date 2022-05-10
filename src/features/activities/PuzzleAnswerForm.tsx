import { Button, Container, Form } from 'semantic-ui-react';
import { Field, Form as FinalForm } from "react-final-form";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired } from 'revalidate';

import { RootStoreContext } from '../../app/stores/rootStore';
import { TextInput } from '../../app/common/form/TextInput';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

const validate = combineValidators({
    answer: composeValidators(
      isRequired({ message: "Odgovor je neophodan" }),
      hasLengthLessThan(100)({
        message: "Za odgovor je dozvoljeno maksimalno 100 karaktera",
      })
    )()
  });

const PuzzleAnswerForm : React.FC<{activityId: string}> = ({activityId})  => {
  const rootStore = useContext(RootStoreContext);
  const { answerPuzzle, submitting } = rootStore.activityStore;

  return (
    <Container>
      <FinalForm
        validate={validate}
        onSubmit={(values) => {
          answerPuzzle(values);
        }}
        render={({ handleSubmit, invalid, pristine }) => (
          <Form autoComplete="off" onSubmit={handleSubmit} error>
            <Field hidden name="id" component="input" initialValue={activityId} />
            <Field name="answer" component={TextInput} placeholder="Odgovor" />
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

export default observer(PuzzleAnswerForm);