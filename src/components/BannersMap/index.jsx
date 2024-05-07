import { Marker, MapContainer, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useState } from "react";
import { useEffect } from "react";

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

const center = [41.001637655845116, 71.65168601394377];

const MapPlaceholder = () => {
  return (
    <p>
      Map of Namangan.{" "}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
};

const index = ({ banners }) => {
  const [markers, setMarkers] = useState([]);

  function getMarkers() {
    banners.forEach((banner) => {
      markers.push({
        location: [banner?.latitude, banner?.longitude],
        name: banner?.name,
      });
    });
  }

  getMarkers();

  return (
    <MapContainer
      style={{ height: "100%", zIndex: 10 }}
      center={markers[0] ? markers[0].location : center}
      zoom={14}
      markerZoomAnimation={true}
      placeholder={<MapPlaceholder />}
      scrollWheelZoom={true}
      touchZoom={"center"}
    >
      <TileLayer {...tileLayer} />

      {markers?.map?.((marker, ind) => (
        <Marker key={ind} position={marker.location}>
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default index;
