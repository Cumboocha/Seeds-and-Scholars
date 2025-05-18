import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultIcon = new L.Icon({
  iconUrl: "assets/marker_sd.png",
  iconRetinaUrl: "assets/marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "",
  shadowSize: [41, 41],
});

const largeIcon = new L.Icon({
  iconUrl: "assets/marker_sd.png",
  iconRetinaUrl: "assets/marker.png",
  iconSize: [40, 65], 
  iconAnchor: [20, 65],
  popupAnchor: [1, -34],
  shadowUrl: "",
  shadowSize: [41, 41],
});

export default function Map({
  isAddingMarker,
  setIsAddingMarker,
  setDashboardScreen,
  setScreen,
  onMarkerPlaced,
  isProfileOpen,
  selectedMarkerId,
  setSelectedMarkerId,
}) {

  const CARTO_URL =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png";
  const SATELLITE_URL =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const [markers, setMarkers] = useState([]);
  const [tempPosition, setTempPosition] = useState(null);
  const [tileUrl, setTileUrl] = useState(CARTO_URL);
  useEffect(() => {
    async function fetchRestaurantMarkers() {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const restoMarkers = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.isAccepted === true &&
          typeof data.latitude === "number" &&
          typeof data.longitude === "number"
        ) {
          restoMarkers.push({
            id: doc.id,
            lat: data.latitude,
            lng: data.longitude,
            name: data.name || "",
          });
        }
      });
      setMarkers(restoMarkers);
    }
    fetchRestaurantMarkers();
  }, []);

  useEffect(() => {
    if (!isProfileOpen && setSelectedMarkerId) {
      setSelectedMarkerId(null);
    }
  }, [isProfileOpen, setSelectedMarkerId]);

  window.addMarkerFromForm = () => {
    if (tempPosition) {
      setMarkers([...markers, { lat: tempPosition.lat, lng: tempPosition.lng }]);
      setTempPosition(null);
      setIsAddingMarker(false);
    }
  };

  function AddMarkerOnClick() {
    useMapEvents({
      click(e) {
        if (isAddingMarker) {
          setTempPosition(e.latlng);
          setDashboardScreen("reg-est");
          if (onMarkerPlaced) {
            onMarkerPlaced({ lat: e.latlng.lat, lng: e.latlng.lng });
          }
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


  const userType =
    sessionStorage.getItem("userType") || localStorage.getItem("userType");

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
        {markers.map((marker, idx) => (
          <Marker
            key={marker.id || idx}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={selectedMarkerId === marker.id ? largeIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                if (selectedMarkerId === marker.id) {
                  if (setSelectedMarkerId) setSelectedMarkerId(null);
                  if (setScreen) setScreen("list");
                } else {
                  if (setSelectedMarkerId) setSelectedMarkerId(marker.id);
                  if (onMarkerPlaced) {
                    onMarkerPlaced({ lat: marker.lat, lng: marker.lng, id: marker.id, name: marker.name });
                  }
                  if (setScreen) setScreen("resto-profile");
                }
              },
            }}
          />
        ))}
        {tempPosition && (
          <Marker position={tempPosition} icon={largeIcon} />
        )}
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
        {userType == "SXduDAM4N2f9FN3bS3vZ" && (
          <img
            className="add-marker-btn"
            src="assets/add_marker_btn.png"
            onClick={toggleAddMarkerMode}
          />
        )}
      </div>
    </div>
  );
}
