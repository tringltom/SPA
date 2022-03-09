import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { format } from 'date-fns';
import React, { useContext } from 'react'
import { Button, Card, Icon, Item, Label, Segment } from 'semantic-ui-react';
import ModalYesNo from '../../app/common/modals/ModalYesNo';
import { ActivityTypes, IActivity, IPhoto } from '../../app/models/activity';
import { RootStoreContext } from '../../app/stores/rootStore';
import { LatLngLiteral} from '../../app/models/googleMaps'

export const PendingActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { approvePendingActivity } = rootStore.activityStore;


  const center = {
    lat: activity.latitude ?? 44.7470721,
    lng: activity.longitude ?? 20.4518071
  };

  const mapOptions = {
    center: center,
    disableDefaultUI: true,
    zoom: 15,
    zoomControl: true,
  };

  const containerStyle = {
    width: "400px",
    height: "400px",
  };
 
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAGraVkB2T6hAEWpq7DefFBzn9YkkWgg7I&libraries=places&language=sr-Latn"
  })

  const latLng: LatLngLiteral
  = ({lat: activity.latitude!, lng: activity.longitude!});

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
      {(activity.location || activity.startDate) && (
        <Segment>
          {activity.startDate && <Icon name="clock" />}
          {activity.startDate &&
            format(new Date(activity.startDate), "d.M.yyyy H:mm ")}
          {activity.endDate &&
            format(new Date(activity.endDate), "- d.M.yyyy H:mm ")}
          {activity.location && <Icon name="marker" />}
          {activity.location}
          {activity.longitude && isLoaded && (
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
