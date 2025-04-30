import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

export default function Map({ isAddingMarker, setIsAddingMarker, setDashboardScreen }) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "assets/marker.png",
    iconUrl:
      "assets/marker_sd.png",
    shadowUrl: "",
  });

  const [markers, setMarkers] = useState([]);

  const addMarker = (position) => {
    setMarkers([...markers, position]);
    setIsAddingMarker(false);
  };

  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        if (isAddingMarker) {
          setDashboardScreen("reg-est");
          addMarker(e.latlng);
        }
      },
    });
    return null;
  }

  const toggleAddMarkerMode = () => {
    setIsAddingMarker(!isAddingMarker);
  };

  return (
    <div className="map-container" style={{ flex: 1, position: "relative" }}>
      <MapContainer
        center={[14.609565164088995, 120.9893454570484]}
        zoom={17}
        maxBounds={[
          [14.616973453895913, 120.98267171224315],
          [14.596743606775185, 121.00135332969086],
        ]}
        maxBoundsViscosity={0.5}
        minZoom={15}
        style={{ width: "78%", height: "87%" }}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
        <AddMarkerOnClick />
        {markers.map((position, idx) => (
          <Marker key={`marker-${idx}`} position={position} />
        ))}
      </MapContainer>

      <img className="map-bg" src="assets/map_bg.png" />
      <div className="map-buttons-container">
        <img className="map-filter-btn" src="assets/filter_btn.png" />
        <img
          className="add-marker-btn"
          src="assets/add_marker_btn.png"
          onClick={toggleAddMarkerMode}
        />
      </div>
    </div>
  );
}
