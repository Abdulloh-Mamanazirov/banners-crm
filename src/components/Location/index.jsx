import { useState } from "react";
import {
  Marker,
  MapContainer,
  TileLayer,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const tileLayer = {
  attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
};

const AddLocation = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e);
    },
  });
  return "";
};

const MapPlaceholder = () => {
  return (
    <p>
      Map of Namangan.{" "}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
};

const index = ({ handlePickLocation, location }) => {
  const [position, setPosition] = useState([]);
  const center = location ? location : [41.001637655845116, 71.65168601394377];

  return (
    <MapContainer
      style={{ height: "100%", zIndex: 10 }}
      center={position.length > 0 ? position : center}
      zoom={14}
      markerZoomAnimation={true}
      placeholder={<MapPlaceholder />}
      scrollWheelZoom={true}
    >
      <AddLocation
        onClick={(e) => {
          setPosition([e?.latlng?.lat, e?.latlng?.lng]);
          handlePickLocation(e);
        }}
      />

      <TileLayer {...tileLayer} />

      <Marker
        draggable={false}
        position={position.length > 0 ? position : center}
      >
        <Popup>New Billboard</Popup>
      </Marker>
    </MapContainer>
  );
};

export default index;
