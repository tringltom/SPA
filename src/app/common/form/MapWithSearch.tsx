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

const libs = ["places"];

const center = {
  lat: -3.745,
  lng: -38.523
};

const mapOptions = {
    center: center,
    disableDefaultUI: true,
    zoom: 10,
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

    const [marker, setMarker] = useState<LatLngLiteral | null>(null);
    const [coords, setLocation] = useState<ICoords | null>(null);

    const onMapClick = React.useCallback((e: MapMouseEvent) => {
        setMarker({
            lat: (e.latLng!.lat()),
            lng: (e.latLng!.lng())})
        setLocation({
            lat: (e.latLng!.lat()),
            lng: (e.latLng!.lng()),
            location: ""
            })
        }, []);

    useEffect(() => {
        return () => {
            props.onChange(coords);
        };
      });

    return (
            <LoadScript
              //googleMapsApiKey="AIzaSyBpNUqI_P-ouHh0KR24n0gLRUD4VUfX5v0"
              googleMapsApiKey="AIzaSyAGraVkB2T6hAEWpq7DefFBzn9YkkWgg7I"
              libraries = {["places"]}
            >
            <GoogleMap
            options={mapOptions}
            mapContainerStyle={containerStyle}
            onClick={onMapClick}
            onLoad={onMapLoad}
            >
            <Search />
            {marker !== null && 
                (
                <Marker position={{ lat: marker.lat, lng: marker.lng }}/>
                )}
            </GoogleMap>
            </LoadScript>
    )
}

const Search: React.FC = () => {
  const { ready, value, suggestions: {status, data},
  setValue, clearSuggestions} = usePlacesAutocomplete({
    requestOptions: {
      // location: { lat: () => -3.745,
      // lng: () => -38.523},
      // radius: 200 * 1000,
    },
  });

  const mapRef = React.useRef<MapType>();
  const Pan = React.useCallback(({ lat, lng }) => {
    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(14);
    console.log(lat);
  }, []);
  
  return <div className="autoCompleteSearch">
    <Combobox
      onSelect={async (address) => {
        setValue(address, false);
        clearSuggestions(); 
        console.log(address);
        try {
            const results = await getGeocode({address});
            const { lat , lng } = await getLatLng(results[0]);
            Pan({lat, lng});
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