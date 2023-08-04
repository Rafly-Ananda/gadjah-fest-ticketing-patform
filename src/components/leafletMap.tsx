"use client";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Icon } from "leaflet";

export default function LeafletMap() {
  return (
    <div>
      <MapContainer
        className="h-[250px] w-[390px]"
        center={[-5.182474710880809, 105.78746708465773]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[-5.182474710880809, 105.78746708465773]}
          icon={
            new Icon({
              iconUrl: "/map-marker.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })
          }
        ></Marker>
      </MapContainer>
    </div>
  );
}
