"use client";
import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: -5.182474710880809,
  lng: 105.78746708465773,
};

export default function GoogleMapLocation() {
  const [_, setMap] = useState<any | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_API_KEY as string,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    map.setZoom(15);
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={{ lat: -5.182818832364169, lng: 105.7875116834032 }} />
    </GoogleMap>
  ) : (
    <></>
  );
}
