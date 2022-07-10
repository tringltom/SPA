import { ActivityTypes, IActivity, IPhoto } from '../../app/models/activity';
import { Button, Card, Icon, Item, Segment } from 'semantic-ui-react';
import React, { useContext } from 'react'

import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { MapLocation } from '../../app/common/form/MapLocation';

export const PendingActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { approvePendingActivity } = rootStore.activityStore;

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header>{activity.title}</Item.Header>
              <Item.Description as='a' href={`/profile/${activity.userId}`}>
                Stvaralac: {activity.userName}
              </Item.Description>
              {activity.photos?.map((photo: IPhoto) => (
                <Card key={photo.id} fluid>
                  <Item.Image src={photo.url || "/assets/user.png"} />
                </Card>
              ))}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      {(activity.location || activity.startDate) && (
        <Segment>
          {activity.startDate && <Icon name="clock" />}
          {activity.startDate &&
            format(new Date(activity.startDate), "d.M.yyyy H:mm ")}
          {activity.endDate &&
            format(new Date(activity.endDate), "- d.M.yyyy H:mm ")}
          {activity.location && <Icon name="marker" />}
          {activity.location}
          {activity && activity.longitude && (
            <MapLocation
              width="200px"
              height="200px"
              latitude={activity.latitude!}
              longitude={activity.longitude!}
              showSearch={false}
              marker={{lat: activity.latitude!, lng: activity.longitude!}}
            />
          )}
        </Segment>
      )}
      <Segment secondary>{activity.description}</Segment>
      <Segment clearing>
        {activity.type === ActivityTypes.Puzzle && (
          <span>Odgovor: {activity.answer}</span>
        )}
        <Button
          floated="right"
          content="Dozvoli"
          color="green"
          onClick={() =>
            openModal(
              <ModalYesNo
                handleConfirmation={async () =>
                  await approvePendingActivity(activity.id, true)
                }
                content="Dozvoliti aktivnost"
                icon="thumbs up"
              />,
              false
            )
          }
        />
        <Button
          floated="right"
          content="Odbij"
          color="red"
          onClick={() =>
            openModal(
              <ModalYesNo
                handleConfirmation={async () =>
                  await approvePendingActivity(activity.id, false)
                }
                content="Odbiti aktivnost"
                icon="thumbs down"
              />,
              false
            )
          }
        />
      </Segment>
    </Segment.Group>
  );
}
