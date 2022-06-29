import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { LatLngLiteral } from "../../models/googleMaps";
import { MapSearch } from "./MapSearch";

interface IProps {
  width: string,
  height: string,
  onMapClick? : (e: any) => void,
  onMapLoad? : (map: any) => void,
  latitude? : number,
  longitude? : number,
  marker : LatLngLiteral | null,
  showSearch: boolean,
  addressCombo?: string,
  panTo? : ({ lat, lng }: any, address: any) => void,
}

export const MapLocation: React.FC<IProps> = ({
  width,
  height,
  onMapClick = () => {},
  onMapLoad = (map) => {
    map.setZoom(15);
  },
  latitude = 44.7470721,
  longitude = 20.4518071,
  marker,
  showSearch = false,
  addressCombo = "",
  panTo = () => {},
}) => {

  const containerStyle = {
    width: width,
    height: height,
  };

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const mapOptions = {
    center: center,
    disableDefaultUI: true,
    zoom: 15,
    zoomControl: true,
  };

  console.log(mapOptions)
  return (
    <GoogleMap
      options={mapOptions}
      mapContainerStyle={containerStyle}
      onClick={onMapClick}
      onLoad={onMapLoad}
    >
      {showSearch && <MapSearch panTo={panTo} addressCombo={addressCombo} />}
      {marker !== null && (
        <Marker position={{ lat: marker.lat, lng: marker.lng }} />
      )}
    </GoogleMap>
  );
};


