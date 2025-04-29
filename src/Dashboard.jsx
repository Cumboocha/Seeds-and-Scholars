import NavBar from "./NavBar";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 

export default function Dashboard() {
    return (
        <div className="dashboard-body">
            <NavBar />
            <div className="dashboard-main" style={{ display: "flex" }}>
                <div className="map-container" style={{ flex: 1, position: "relative"}}>
                    <MapContainer
                        center={[14.609565164088995, 120.9893454570484]} 
                        zoom={17}
                        maxBounds={[[14.616973453895913, 120.98267171224315], [14.596743606775185, 121.00135332969086]]}
                        maxBoundsViscosity={0.5}
                        minZoom={15}
                        style={{ width: "78%", height: "87%" }}
                    >
                        <TileLayer
                            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                        />
                    </MapContainer>
                    <img className="map-bg" src="assets/map_bg.png" />
                    <div className="map-buttons-container">
                        <img className="map-filter-btn" src="assets/filter_btn.png" />
                        <img className="add-marker-btn" src="assets/add_marker_btn.png" />
                    </div>
                </div>

                <div className="resto-container">
                    <div className="resto-container-green-part">
                        <div className="resto-name-container">
                            <p>Kusinang Bayan</p>
                        </div>
                        <div className="resto-container-white-part">
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
