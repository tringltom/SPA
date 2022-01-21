import React, { Fragment } from 'react';
import { Segment, Button, Placeholder } from 'semantic-ui-react';

const PendingActivityListItemPlaceholder = () => {
  return (
    <Fragment>
      {[...Array(4)].map((el, i) => (
        <Placeholder key={i} fluid>
          <Segment.Group>
            <Segment style={{ minHeight: 110 }}>
              <Placeholder>
                <Placeholder.Header image>
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            </Segment>
            <Segment>
              <Placeholder>
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder>
            </Segment>
            <Segment secondary style={{ minHeight: 70 }} />
            <Segment clearing>
               <Button
                disabled
                color="green"
                floated="right"
                content="Učitava se.."
              />
              <Button
                disabled
                color="red"
                floated="right"
                content="Učitava se.."
              />
            </Segment>
          </Segment.Group>
        </Placeholder>
      ))}
    </Fragment>
  );
};

export default PendingActivityListItemPlaceholder;