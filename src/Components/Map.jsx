import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

export default function Map({
  isAddingMarker,
  setIsAddingMarker,
  setDashboardScreen,
  setScreen,
}) {
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "assets/marker.png",
    iconUrl: "assets/marker_sd.png",
    shadowUrl: "",
  });

  const CARTO_URL =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";
  const SATELLITE_URL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const [markers, setMarkers] = useState([]);
  const [tempPosition, setTempPosition] = useState(null);
  const [tileUrl, setTileUrl] = useState(CARTO_URL);

  window.addMarkerFromForm = () => {
    if (tempPosition) {
      setMarkers([...markers, tempPosition]);
      setTempPosition(null);
      setIsAddingMarker(false);
    }
  };

  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        if (isAddingMarker) {
          setTempPosition(e.latlng); // Stores lat/lng of clicked position, then uses it later if na-submit na
          setDashboardScreen("reg-est");
        }
      },
    });
    return null;
  }

  const toggleAddMarkerMode = () => {
    setIsAddingMarker(!isAddingMarker);
  };

  const toggleTile = () => {
    setTileUrl(prev =>
      prev === CARTO_URL ? SATELLITE_URL : CARTO_URL
    );
  };

  return (
    <div className="map-container" style={{ flex: 1, position: "relative" }}>
      <MapContainer
        center={[14.609822938539528, 120.98966181354407]}
        zoom={17}
        maxBounds={[
          [14.6221294420654, 120.96390938862099],
          [14.5650967182169, 121.01913999773225],
        ]}
        maxBoundsViscosity={0.5}
        minZoom={14}
        style={{ width: "78%", height: "87%" }}
      >
        <TileLayer url={tileUrl} />
        <AddMarkerOnClick />
        {markers.map((position, idx) => (
          <Marker
            key={`marker-${idx}`}
            position={position}
            eventHandlers={{
              click: () => {
                setScreen("resto-profile");
              }, // Function that opens resto profile when clicked
            }}
          />
        ))}
      </MapContainer>

      <img className="map-bg" src="assets/map_bg.png" />
        <div className="map-buttons-container-left">
        <img
          className="map-btn"
          src="assets/map_btn.png"
          onClick={toggleTile}
        />
      </div>

      <div className="map-buttons-container-right">
        <img
          className="add-marker-btn"
          src="assets/add_marker_btn.png"
          onClick={toggleAddMarkerMode}
        />
      </div>
    </div>
  );
}
