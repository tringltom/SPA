import { Button, Comment, Form, Header, Segment } from "semantic-ui-react";
import {Field, Form as FinalForm} from 'react-final-form';
import { Fragment, useContext, useEffect } from "react";
import { combineValidators, composeValidators, hasLengthLessThan, isRequired } from "revalidate";

import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";
import { formatDistance } from "date-fns";
import { observer } from "mobx-react-lite";
import srLocale from 'date-fns/locale/sr-Latn'

const Chat = () => {
  
  const rootStore = useContext(RootStoreContext);
  
  const {
    createHubConnection,
    stopHubConnection,
    addComment
  } = rootStore.hubStore;

  const {approvedActivity} = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(approvedActivity!.id);
    return () => {
      stopHubConnection(approvedActivity!.id);
    }
  }, [createHubConnection, stopHubConnection, approvedActivity])

  const validate = combineValidators({
    body: composeValidators(
      isRequired({ message: "Komentar je neophodan" }),
      hasLengthLessThan(50)({
        message: "Za komentar je dozvoljeno maksimalno 50 karaktera",
      })
    )(),
  });

  return (
    <Fragment>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='teal'
        style={{ border: 'none' }}
      >
        <Header>Diskusija</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {approvedActivity && approvedActivity.comments && approvedActivity.comments.map((comment) => (
          <Comment key={comment.id}>
          <Comment.Avatar src={comment.image?.url || '/assets/user.png'} />
          <Comment.Content>
            <Comment.Author as={Link} to={`/profile/${comment.userId}`}>{comment.userName}</Comment.Author>
            <Comment.Metadata>
              <div>{formatDistance(new Date(comment.createdAt), new Date(), { locale : srLocale, includeSeconds: true})}</div>
            </Comment.Metadata>
            <Comment.Text>{comment.body}</Comment.Text>
          </Comment.Content>
        </Comment>
          ))}

          <FinalForm 
            onSubmit={addComment}
            validate={validate}
            render={({handleSubmit, submitting, form, invalid, pristine }) => (
              <Form onSubmit={() => {handleSubmit()!.then(() => form.restart())}}>
              <Field 
                name='body'
                component={TextAreaInput}
                rows={2}
                placeholder='Dodaj svoj komentar'
              />
              <Button
                loading={submitting}
                disabled={submitting || invalid || pristine}
                content='Prokomentariši'
                labelPosition='left'
                icon='edit'
                primary
              />
            </Form>
            )}
          />

        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(Chat);