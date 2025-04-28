import NavBar from "./NavBar";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 

export default function Dashboard() {
    return (
        <div className="dashboard-body">
            <NavBar />
            <div className="dashboard-main" style={{ display: "flex" }}>
                <div className="map-container" style={{ flex: 1, position: "relative", height: "600px" }}>
                    <MapContainer
                        center={[14.609565164088995, 120.9893454570484]} 
                        zoom={17}
                        maxBounds={[[14.616973453895913, 120.98267171224315], [14.596743606775185, 121.00135332969086]]}
                        maxBoundsViscosity={1.0}
                        minZoom={15}
                        style={{ width: "78%", height: "87%" }}
                    >
                        <TileLayer
                            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                        />
                    </MapContainer>
                    <img src="assets/map_bg.png" />
                </div>

                <div className="resto-container">
                    {/* Right Side */}
                </div>
            </div>
        </div>
    );
}
