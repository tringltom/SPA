import { ActivityTypes, IActivity, IPhoto } from '../../app/models/activity';
import { Button, Card, Icon, Item, Label, Segment } from 'semantic-ui-react';
import React, { useContext, useState } from 'react'

import PuzzleAnswerForm from './PuzzleAnswerForm';
import { ReviewButtonsComponent } from '../../app/common/form/ReviewButtonsComponent';
import { ReviewTypes } from '../../app/models/review';
import { RootStoreContext } from '../../app/stores/rootStore';
import { format } from 'date-fns';
import { getButtonData } from '../../app/layout/ReviewButtonData';

export const ApprovedActivityListItem: React.FC<{activity: IActivity, favorite:boolean, review: ReviewTypes | null}> = ({activity, favorite, review}) => {

  console.log(activity.numberOfAttendees)
  const rootStore = useContext(RootStoreContext);
  const { reviewActivity, reviewing } = rootStore.reviewStore;
  const { resolveFavoriteActivity, resolvingFavourite } = rootStore.favoriteStore;
  const { userId } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  const buttonData = getButtonData(activity.type);

  const [activeButton, setActiveButton] = useState(!!review ? buttonData[review - 1]?.name : null);
  const [isFavorite, setFavorite] = React.useState<boolean>(favorite);

  const toggleFavorite = () => {
      setFavorite(!isFavorite);
      resolveFavoriteActivity(+activity.id, !isFavorite);
  }

  const handleReviewClick = (e: any) => {
    if (activeButton === e.target.name || !(!!userId))
    {
      return;
    }

    setActiveButton(e.target.name);
    const reviewType = e.target.value;
    reviewActivity(+activity.id, activity.type, reviewType);
  }

  // const center = {
  //   lat: activity.latitude ?? 44.7470721,
  //   lng: activity.longitude ?? 20.4518071
  // };

  // const mapOptions = {
  //   center: center,
  //   disableDefaultUI: true,
  //   zoom: 15
  // };

  // const containerStyle = {
  //   width: "200px",
  //   height: "200px",
  // };
 
  // const { isLoaded } = useJsApiLoader({
  //   id: 'google-map-script',
  //   googleMapsApiKey: "AIzaSyAGraVkB2T6hAEWpq7DefFBzn9YkkWgg7I&libraries=places&language=sr-Latn"
  // })

  // const latLng: LatLngLiteral
  // = ({lat: activity.latitude!, lng: activity.longitude!});

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header>{activity.title}</Item.Header>
              <Item.Description>
                Stvaralac: {activity.userName}
              </Item.Description>
              {activity?.type === ActivityTypes.Happening && activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="Vi ste kreirali ovaj dogadjaj"
                  />
                </Item.Description>
              )}
              {activity.photos?.map((photo: IPhoto) => (
                <Card key={photo.id} fluid>
                  <Item.Image src={photo.url || "/assets/user.png"} />
                </Card>
              ))}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      {activity.numberOfAttendees > 0 && <Label basic color="blue" content={`Broj učesnika: ${activity.numberOfAttendees}`}/>}
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
      <Segment clearing>
        {activity.type === ActivityTypes.Puzzle && (
          <Button icon='microphone' content='Odgovori' floated='right' onClick={() => openModal(<PuzzleAnswerForm activityId={activity.id} />)}></Button>
        )}
      </Segment>
      <Segment>
        <Button icon='favorite' loading={resolvingFavourite} active={isFavorite} onClick={toggleFavorite}/>
        <ReviewButtonsComponent buttonData={buttonData} activeButton={activeButton} handleReviewClick={handleReviewClick} loading={reviewing} float='right'/>
      </Segment>
    </Segment.Group>
  );
}
