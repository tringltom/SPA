import React, { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Input } from "semantic-ui-react";
import { FieldInputProps } from "react-final-form";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

interface ICoords
{
    lat: number;
    lng: number;
    location: string;
}

interface IProps {
    props : FieldInputProps<Input, HTMLElement>
  }

type LatLngLiteral = google.maps.LatLngLiteral;
type MapMouseEvent = google.maps.MapMouseEvent;
type MapType = google.maps.Map;

const center = {
  lat: 44.7470721,
  lng: 20.4518071
};

const mapOptions = {
    center: center,
    disableDefaultUI: true,
    zoom: 15,
    zoomControl: true
};

const containerStyle = {
    width: '400px',
    height: '400px'
};

export const MapWithSearch: React.FC<IProps> = ({props
  }) => {
    
    const mapRef = React.useRef<MapType>();
    const onMapLoad = React.useCallback((map: MapType) => {
      mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }, address) => {
      mapRef.current?.panTo({ lat, lng });
      mapRef.current?.setZoom(14);
      setMarker({
        lat: lat,
        lng: lng});
      setCoords({
        lat: lat,
        lng: lng,
        location: address
        });
    }, []);

    const [marker, setMarker] = useState<LatLngLiteral | null>(null);
    const [coords, setCoords] = useState<ICoords | null>(null);
    const coordsRef = React.useRef<ICoords | null>();
    coordsRef.current = coords;

    const onMapClick = React.useCallback( async (e: MapMouseEvent) => {
          const latLng: google.maps.LatLngLiteral
          = ({lat: e.latLng!.lat(), lng: e.latLng!.lng()});
          try {
            const results = await getGeocode({location: latLng});
            const address = results[0].formatted_address;
            setCoords({
              lat: (e.latLng!.lat()),
              lng: (e.latLng!.lng()),
              location: address
              })
          } catch(error){
          console.log(error);
          }
        setMarker({
            lat: (e.latLng!.lat()),
            lng: (e.latLng!.lng())})
        }, [coords]);

    useEffect(() => {
        return () => {
            props.onChange(coordsRef.current);
        };
      }, [props, coords]);

    return (
            <LoadScript
              //googleMapsApiKey="AIzaSyBpNUqI_P-ouHh0KR24n0gLRUD4VUfX5v0&libraries=places"
              googleMapsApiKey="AIzaSyAGraVkB2T6hAEWpq7DefFBzn9YkkWgg7I&libraries=places&sensor=false&region=SR&language=en"
            >
            <GoogleMap
            options={mapOptions}
            mapContainerStyle={containerStyle}
            onClick={onMapClick}
            onLoad={onMapLoad}
            >
            <Search panTo={panTo}/>
            {marker !== null && 
                (
                <Marker position={{ lat: marker.lat, lng: marker.lng }}/>
                )}
            </GoogleMap>
            </LoadScript>
    )
}

interface IPanToProps {
  panTo: (latLng: LatLngLiteral, address: string) => void
}

const Search: React.FC<IPanToProps> = ({panTo}) => {
  const { ready, value, suggestions: {status, data},
  setValue, clearSuggestions} = usePlacesAutocomplete();

  return <div className="autoCompleteSearch">
    <Combobox
      onSelect={async (address) => {
        setValue(address, false);
        clearSuggestions(); 
        console.log(address);
        try {
            const results = await getGeocode({address});
            const { lat , lng } = await getLatLng(results[0]);
            panTo({lat, lng}, address);
        } catch(error){
          console.log(error);
        }
    }}
    >
        <ComboboxInput value={value}  onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={!ready}
        placeholder="Unesite Adresu"/>
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" && data.map(({place_id, description}) => 
            (<ComboboxOption key={place_id} value={description} />))}
          </ComboboxList> 
        </ComboboxPopover>
      </Combobox>
  </div>
}