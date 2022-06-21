import "@reach/combobox/styles.css";

import { Form, FormFieldProps, Input, Label } from "semantic-ui-react";
import { ICoords, LatLngLiteral, MapMouseEvent, MapType } from '../../models/googleMaps'
import React, { useEffect, useState } from 'react'
import { getGeocode } from "use-places-autocomplete";

import { FieldRenderProps } from "react-final-form";
import { MapLocation } from "./MapLocation";

interface IProps
  extends FieldRenderProps<Input, HTMLElement>,
    FormFieldProps {}

export const MapWithSearchInput: React.FC<IProps> = ({input,
  type,
  meta: { touched, error },
  }) => {
    
    const [addressCombo, setaddressCombo] = useState("");
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
          const latLng: LatLngLiteral
          = ({lat: e.latLng!.lat(), lng: e.latLng!.lng()});
          try {
            const results = await getGeocode({location: latLng});
            const address = results[0].formatted_address;
            setaddressCombo(address);
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
        }, [setCoords]);

    useEffect(() => {
        return () => {
            input.onChange(coordsRef.current);
        };
      }, [input]);

    return (
      <Form.Field error={touched && !!error} type={type}>
            <MapLocation 
            width="400px"
            height="400px"
            onMapClick={onMapClick}
            onMapLoad={onMapLoad}
            marker={marker}
            showSearch={true}
            addressCombo={addressCombo}
            panTo={panTo}
             />
            {touched && !marker && error && (
            <Label basic color="red">
              {error}
            </Label>
      )}       
      </Form.Field>
    );
}