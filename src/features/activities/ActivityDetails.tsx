import { Button, Container, Form, Grid, Segment } from 'semantic-ui-react';
import { Field, Form as FinalForm } from "react-final-form";
import React, {useContext, useEffect} from 'react'
import { combineValidators, isRequired } from 'revalidate';

import { ActivityTypes } from '../../app/models/activity';
import { ApprovedActivityListItem } from './ApprovedActivityListItem';
import { EkvitiColors } from '../../app/layout/EkvitiColors';
import { FileInput } from '../../app/common/form/FileInput';
import { ReviewTypes } from '../../app/models/review';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({images: isRequired({message: 'Slika je neophodna'})});

interface DetailParams {
    id: string;
    favorite: string;
    review: string
  }

const ActivityDetails : React.FC<RouteComponentProps<DetailParams>>= ({match}) => {
  const activityId = match.params.id;
  const favorite = match.params.favorite === "true";
  const review = Number(match.params.review) as ReviewTypes;

  const rootStore = useContext(RootStoreContext);
  const {
    approvedActivity,
    getApprovedActivity,
    resetApprovedActivity,
    completeHappening,
  } = rootStore.activityStore;
  const { openModal } = rootStore.modalStore;

  useEffect(() => {
    if (activityId) getApprovedActivity(activityId);
    else resetApprovedActivity();
    return () => resetApprovedActivity();
  }, [activityId, getApprovedActivity, resetApprovedActivity]);

  return (
    <Grid>
      <Grid.Column width={16}>
        {approvedActivity != null && (
          <Segment clearing>
            <ApprovedActivityListItem
              key={activityId}
              activity={approvedActivity!}
              favorite={favorite}
              review={review}
            />
            {approvedActivity.type === ActivityTypes.Happening &&
              !approvedActivity.isHeld && (
                approvedActivity.isHost &&
                <Segment clearing>
                  <Button
                    floated="right"
                    style={{
                      backgroundColor: EkvitiColors.primary,
                      color: "white",
                    }}
                    content="Završi dogadjaj"
                    onClick={() =>
                      openModal(
                        <Container>
                          <FinalForm
                            validate={validate}
                            onSubmit={(values) => {
                              completeHappening(activityId, values);
                            }}
                            render={({ handleSubmit, invalid, pristine }) => (
                              <Form
                                autoComplete="off"
                                onSubmit={handleSubmit}
                                error
                              >
                                <Field
                                  name="images"
                                  component={FileInput}
                                  maxNumberofFiles={5}
                                />
                                <Button
                                  loading={!rootStore.allowEvents}
                                  disabled={
                                    !rootStore.allowEvents ||
                                    invalid ||
                                    pristine
                                  }
                                  color="teal"
                                  content="Potvrdi"
                                  type="submit"
                                  fluid
                                />
                              </Form>
                            )}
                          />
                        </Container>,
                        true
                      )
                    }
                  />
                </Segment>
              )}
          </Segment>
        )}
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDetails);