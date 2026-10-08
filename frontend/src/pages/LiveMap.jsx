import { useEffect, useState } from "react";

import {
    Layers,
    LocateFixed,
    RefreshCw,
    AlertTriangle
} from "lucide-react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap
} from "react-leaflet";

import L from "leaflet";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

import "leaflet/dist/leaflet.css";


// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});


// NER center - approximate Assam region
const NER_CENTER = [26.2006, 92.9376];


// Component to move map
function MapController({ incidents }) {

    const map = useMap();

    useEffect(() => {

        if (incidents.length > 0) {

            const first = incidents[0];

            map.setView(
                [
                    first.location.latitude,
                    first.location.longitude
                ],
                8
            );
        }

    }, [incidents, map]);

    return null;
}


function LiveMap() {

    const [incidents, setIncidents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // Fetch incidents from backend
    const fetchIncidents = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get("/incidents");

            setIncidents(response.data.data || []);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to connect to the incident service."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchIncidents();

    }, []);


    // Determine marker color based on severity
    const getMarkerColor = (severity) => {

        switch (severity) {

            case "CRITICAL":
                return "#dc2626";

            case "HIGH":
                return "#ef4444";

            case "MEDIUM":
                return "#f97316";

            case "LOW":
                return "#22c55e";

            default:
                return "#2563eb";
        }
    };


    // Create custom marker
    const createMarker = (severity) => {

        const color = getMarkerColor(severity);

        return L.divIcon({

            className: "",

            html: `
                <div style="
                    width: 20px;
                    height: 20px;
                    background: ${color};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.35);
                "></div>
            `,

            iconSize: [20, 20],

            iconAnchor: [10, 10]
        });
    };


    return (

        <div className="app">

            <Sidebar />


            <main className="main-content">

                <Topbar />


                <section className="dashboard">


                    {/* HEADER */}

                    <div className="welcome-row">

                        <div>

                            <h2>
                                Live Map
                            </h2>

                            <p>
                                Real-time road incident monitoring
                                across the North Eastern Region.
                            </p>

                        </div>


                        <button
                            className="primary-button"
                            onClick={fetchIncidents}
                        >

                            <RefreshCw size={15} />

                            Refresh

                        </button>

                    </div>


                    {/* MAP CARD */}

                    <div className="map-card">


                        {/* MAP HEADER */}

                        <div className="card-header">

                            <div>

                                <h3>
                                    Regional Operations Map
                                </h3>

                                <p>
                                    Live incidents from MongoDB
                                </p>

                            </div>


                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        fontSize: "11px",
                                        color: "#64748b"
                                    }}
                                >

                                    <span
                                        style={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            background: "#22c55e"
                                        }}
                                    />

                                    {incidents.length} incidents

                                </div>


                                <button className="outline-button">

                                    <Layers size={13} />

                                    Layers

                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div
                                style={{
                                    padding: "12px 20px",
                                    background: "#fef2f2",
                                    color: "#dc2626",
                                    fontSize: "12px"
                                }}
                            >

                                <AlertTriangle
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: "6px"
                                    }}
                                />

                                {error}

                            </div>

                        )}


                        {/* MAP */}

                        <div
                            style={{
                                height: "600px",
                                width: "100%",
                                position: "relative"
                            }}
                        >

                            <MapContainer
                                center={NER_CENTER}
                                zoom={6}
                                scrollWheelZoom={true}
                                style={{
                                    height: "100%",
                                    width: "100%"
                                }}
                            >

                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />


                                <MapController
                                    incidents={incidents}
                                />


                                {/* INCIDENT MARKERS */}

                                {incidents.map((incident) => (

                                    <div
                                        key={incident._id}
                                    >

                                        <Marker
                                            position={[
                                                incident.location.latitude,
                                                incident.location.longitude
                                            ]}
                                            icon={createMarker(
                                                incident.severity
                                            )}
                                        >

                                            <Popup>

                                                <div
                                                    style={{
                                                        minWidth: "210px"
                                                    }}
                                                >

                                                    <strong
                                                        style={{
                                                            fontSize: "14px"
                                                        }}
                                                    >
                                                        {incident.title}
                                                    </strong>


                                                    <p
                                                        style={{
                                                            margin: "7px 0",
                                                            color: "#64748b",
                                                            fontSize: "11px"
                                                        }}
                                                    >

                                                        {incident.description}

                                                    </p>


                                                    <div
                                                        style={{
                                                            fontSize: "11px",
                                                            lineHeight: "1.7"
                                                        }}
                                                    >

                                                        <strong>
                                                            Road:
                                                        </strong>{" "}

                                                        {incident.roadName}

                                                        <br />


                                                        <strong>
                                                            District:
                                                        </strong>{" "}

                                                        {incident.district}

                                                        <br />


                                                        <strong>
                                                            State:
                                                        </strong>{" "}

                                                        {incident.state}

                                                        <br />


                                                        <strong>
                                                            Type:
                                                        </strong>{" "}

                                                        {incident.incidentType}

                                                        <br />


                                                        <strong>
                                                            Severity:
                                                        </strong>{" "}

                                                        <span
                                                            style={{
                                                                color: getMarkerColor(
                                                                    incident.severity
                                                                ),
                                                                fontWeight: "700"
                                                            }}
                                                        >

                                                            {incident.severity}

                                                        </span>

                                                    </div>


                                                    <div
                                                        style={{
                                                            marginTop: "8px",
                                                            padding: "5px 8px",
                                                            background:
                                                                "#f1f5f9",
                                                            borderRadius: "5px",
                                                            fontSize: "9px",
                                                            display:
                                                                "inline-block"
                                                        }}
                                                    >

                                                        {incident.status}

                                                    </div>

                                                </div>

                                            </Popup>

                                        </Marker>


                                        {/* RISK RADIUS */}

                                        <Circle
                                            center={[
                                                incident.location.latitude,
                                                incident.location.longitude
                                            ]}
                                            radius={
                                                incident.severity === "CRITICAL"
                                                    ? 30000
                                                    : incident.severity === "HIGH"
                                                        ? 20000
                                                        : 10000
                                            }
                                            pathOptions={{
                                                color: getMarkerColor(
                                                    incident.severity
                                                ),
                                                fillColor: getMarkerColor(
                                                    incident.severity
                                                ),
                                                fillOpacity: 0.08,
                                                weight: 1
                                            }}
                                        />

                                    </div>

                                ))}

                            </MapContainer>


                            {/* LOADING */}

                            {loading && (

                                <div
                                    style={{
                                        position: "absolute",
                                        top: "15px",
                                        right: "15px",
                                        zIndex: 1000,
                                        background: "white",
                                        padding: "10px 14px",
                                        borderRadius: "8px",
                                        boxShadow:
                                            "0 3px 12px rgba(0,0,0,0.15)",
                                        fontSize: "11px"
                                    }}
                                >

                                    Loading incidents...

                                </div>

                            )}


                            {/* LOCATE BUTTON */}

                            <button
                                className="outline-button"
                                style={{
                                    position: "absolute",
                                    bottom: "20px",
                                    right: "20px",
                                    zIndex: 1000,
                                    background: "white"
                                }}
                                onClick={() => {

                                    if (
                                        navigator.geolocation
                                    ) {

                                        navigator.geolocation.getCurrentPosition(
                                            (position) => {

                                                console.log(
                                                    "User location:",
                                                    position.coords
                                                );

                                                alert(
                                                    "Your location detected."
                                                );

                                            },
                                            () => {

                                                alert(
                                                    "Unable to access your location."
                                                );

                                            }
                                        );

                                    }

                                }}
                            >

                                <LocateFixed size={13} />

                                Locate Me

                            </button>

                        </div>

                    </div>


                    {/* INCIDENT SUMMARY */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(4, 1fr)",
                            gap: "15px",
                            marginTop: "20px"
                        }}
                    >

                        <div className="stat-card">

                            <p>
                                Total Incidents
                            </p>

                            <h3>
                                {incidents.length}
                            </h3>

                            <span className="stat-description">
                                From MongoDB
                            </span>

                        </div>


                        <div className="stat-card">

                            <p>
                                Critical
                            </p>

                            <h3>

                                {
                                    incidents.filter(
                                        i =>
                                            i.severity === "CRITICAL"
                                    ).length
                                }

                            </h3>

                            <span className="stat-description">
                                Immediate attention
                            </span>

                        </div>


                        <div className="stat-card">

                            <p>
                                High Risk
                            </p>

                            <h3>

                                {
                                    incidents.filter(
                                        i =>
                                            i.severity === "HIGH"
                                    ).length
                                }

                            </h3>

                            <span className="stat-description">
                                High severity incidents
                            </span>

                        </div>


                        <div className="stat-card">

                            <p>
                                Pending
                            </p>

                            <h3>

                                {
                                    incidents.filter(
                                        i =>
                                            i.status === "PENDING"
                                    ).length
                                }

                            </h3>

                            <span className="stat-description">
                                Awaiting verification
                            </span>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}


export default LiveMap;