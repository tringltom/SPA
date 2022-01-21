import React, { Fragment } from 'react';
import { Segment, Button, Placeholder } from 'semantic-ui-react';
import { ReviewButtonsComponent } from '../../app/common/form/ReviewButtonsComponent';
import { getButtonData } from '../../app/layout/ReviewButtonData';

const buttonData = getButtonData(null);

const ApprovedActivityListItemPlaceholder = () => {
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
                <Button disabled={true} icon={"question"} active={false}/>
                <ReviewButtonsComponent buttonData={buttonData} activeButton={null} handleReviewClick={() => {}} float='right' disabled={true}/>
            </Segment>
          </Segment.Group>
        </Placeholder>
      ))}
    </Fragment>
  );
};

export default ApprovedActivityListItemPlaceholder;