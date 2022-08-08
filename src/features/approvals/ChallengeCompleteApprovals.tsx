import { Button, Card, Divider, Grid, Header, Icon, Item, Loader, Segment } from 'semantic-ui-react';
import { IChallenge, IPhoto } from '../../app/models/activity';
import { useContext, useEffect, useState } from 'react'

import InfiniteScroll from 'react-infinite-scroller';
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import PendingActivityListItemPlaceholder from '../activities/PendingActivityListItemPlaceholder';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';

const ChallengeCompleteApprovals = () => {

  const rootStore = useContext(RootStoreContext);
  
  const {
    loadChallengeConfirmedAnswers,
    loadingInitial,
    setChallengeApprovalPage,
    challengeApprovalPage,
    totalChallengeApprovalPages,
    challengeApprovalArray,
    approveChallenge
  } = rootStore.challengeStore;
  
  const { openModal } = rootStore.modalStore;
  
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setChallengeApprovalPage(challengeApprovalPage + 1);
    loadChallengeConfirmedAnswers().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadChallengeConfirmedAnswers();
  }, [loadChallengeConfirmedAnswers]);

  return (
    <Grid>
      <Grid.Column width={16}>
        {loadingInitial && challengeApprovalPage === 0 ? (
          <PendingActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={
              !loadingNext &&
              challengeApprovalPage + 1 < totalChallengeApprovalPages
            }
            initialLoad={false}
          >
            {challengeApprovalArray.map((activity: IChallenge) => (
            <Segment.Group key={activity.id}>
              <Segment>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Item.Header>{activity.title}</Item.Header>
                      <Item.Description>
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
                  {/* {activity.longitude && isLoaded && (
            <GoogleMap
              options={mapOptions}
              mapContainerStyle={containerStyle}
              onLoad={(map) => {
                const bounds = new window.google.maps.LatLngBounds({
                  lat: activity.latitude!,
                  lng: activity.longitude!,
                });
                map.fitBounds(bounds);
              }}
            >
              <Marker position={{ lat: latLng.lat, lng: latLng.lng }} />
            </GoogleMap>
          )} */}
                </Segment>
              )}
              <Segment secondary>{activity.description}</Segment>
              <Divider horizontal></Divider>
              <Header textAlign='center'>Odgovor:</Header>
              <Segment>{activity.challengeDesription}</Segment>
              {activity.challengePhotos?.map((photo: IPhoto) => (
                        <Card key={photo.id} fluid>
                          <Item.Image src={photo.url || "/assets/user.png"} />
                        </Card>
                      ))}
              <Segment clearing>
                <Button
                  floated="right"
                  content="Dozvoli"
                  color="green"
                  onClick={() =>
                    openModal(
                      <ModalYesNo
                        handleConfirmation={async () =>
                          await approveChallenge(activity.challengeAnswerId, true)
                        }
                        content="Dozvoliti rešenje izazova"
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
                          await approveChallenge(activity.challengeAnswerId, false)
                        }
                        content="Odbiti ređenje izazova"
                        icon="thumbs down"
                      />,
                      false
                    )
                  }
                />
              </Segment>
            </Segment.Group>
            ))}
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={16}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ChallengeCompleteApprovals);