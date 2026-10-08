import { useState } from "react";

import {
    Navigation,
    MapPin,
    Route,
    ShieldCheck,
    AlertTriangle,
    Clock,
    RefreshCw
} from "lucide-react";

import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup,
    useMap
} from "react-leaflet";

import L from "leaflet";

import api from "../services/api";

import "leaflet/dist/leaflet.css";


// ==========================================
// LEAFLET ICON FIX
// ==========================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});


// ==========================================
// MAP CONTROLLER
// ==========================================

function RouteMapController({
    route
}) {
    const map = useMap();

    if (
        route &&
        route.geometry &&
        route.geometry.coordinates &&
        route.geometry.coordinates.length
    ) {
        const points =
            route.geometry.coordinates.map(
                (point) => [
                    point[1],
                    point[0]
                ]
            );

        map.fitBounds(points, {
            padding: [40, 40]
        });
    }

    return null;
}


// ==========================================
// MAIN COMPONENT
// ==========================================

function RoutePlanner() {

    const [origin, setOrigin] =
        useState("");

    const [destination, setDestination] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [routeData, setRouteData] =
        useState(null);

    const [selectedRoute, setSelectedRoute] =
        useState(null);


    // ======================================
    // FIND ROUTE
    // ======================================

    const findRoute = async () => {

        if (
            !origin.trim() ||
            !destination.trim()
        ) {
            setError(
                "Please enter both origin and destination."
            );

            return;
        }

        try {

            setLoading(true);

            setError("");

            const response =
                await api.post(
                    "/routes/smart",
                    {
                        origin,
                        destination
                    }
                );

            setRouteData(
                response.data
            );

            const recommended =
                response.data.routes.find(
                    (route) =>
                        route.isRecommended
                );

            setSelectedRoute(
                recommended ||
                response.data.routes[0]
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to calculate route."
            );

        } finally {

            setLoading(false);

        }
    };


    // ======================================
    // RESET
    // ======================================

    const resetPlanner = () => {

        setOrigin("");

        setDestination("");

        setRouteData(null);

        setSelectedRoute(null);

        setError("");

    };


    // ======================================
    // SAFETY LABEL
    // ======================================

    const getSafetyLabel = (
        score
    ) => {

        if (score >= 80) {
            return "SAFE";
        }

        if (score >= 60) {
            return "MODERATE";
        }

        return "HIGH RISK";
    };


    const getSafetyClass = (
        score
    ) => {

        if (score >= 80) {
            return "safe";
        }

        if (score >= 60) {
            return "moderate";
        }

        return "danger";
    };


    // ======================================
    // RENDER
    // ======================================

    return (

        <div className="page-container route-planner-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="page-header">

                <div>

                    <p className="breadcrumb">
                        NER Intelligence /
                        Route Planner
                    </p>

                    <h1>
                        Smart Route Planner
                    </h1>

                    <p>
                        Find safer routes using
                        verified road incidents
                        and real road data.
                    </p>

                </div>


                <button
                    className="secondary-button"
                    onClick={resetPlanner}
                >

                    <RefreshCw size={17} />

                    Reset

                </button>

            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="route-search-card">


                {/* Origin */}

                <div className="route-input">

                    <MapPin size={19} />

                    <div>

                        <label>
                            ORIGIN
                        </label>

                        <input
                            type="text"
                            value={origin}
                            onChange={(event) =>
                                setOrigin(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Guwahati, Assam"
                        />

                    </div>

                </div>


                <div className="route-line"></div>


                {/* Destination */}

                <div className="route-input">

                    <Navigation size={19} />

                    <div>

                        <label>
                            DESTINATION
                        </label>

                        <input
                            type="text"
                            value={destination}
                            onChange={(event) =>
                                setDestination(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Shillong, Meghalaya"
                        />

                    </div>

                </div>


                {/* Button */}

                <button
                    className="primary-button route-button"
                    onClick={findRoute}
                    disabled={loading}
                >

                    {loading ? (

                        <>
                            <RefreshCw
                                size={18}
                                className="spin"
                            />

                            Calculating...
                        </>

                    ) : (

                        <>
                            <Route size={18} />

                            Find Smart Route
                        </>

                    )}

                </button>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className="route-error">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            {/* ==================================
                RESULTS
            ================================== */}

            {routeData && (

                <>

                    {/* Summary */}

                    <div className="route-summary-grid">


                        <div className="route-stat">

                            <span>
                                ROUTES FOUND
                            </span>

                            <strong>
                                {
                                    routeData.routes
                                        .length
                                }
                            </strong>

                        </div>


                        <div className="route-stat">

                            <span>
                                INCIDENTS CHECKED
                            </span>

                            <strong>
                                {
                                    routeData
                                        .incidentsChecked
                                }
                            </strong>

                        </div>


                        <div className="route-stat">

                            <span>
                                RECOMMENDED SAFETY
                            </span>

                            <strong>
                                {
                                    selectedRoute
                                        ?.safetyScore
                                }
                                /100
                            </strong>

                        </div>


                        <div className="route-stat">

                            <span>
                                STATUS
                            </span>

                            <strong
                                className={
                                    getSafetyClass(
                                        selectedRoute
                                            ?.safetyScore ||
                                        0
                                    )
                                }
                            >
                                {
                                    getSafetyLabel(
                                        selectedRoute
                                            ?.safetyScore ||
                                        0
                                    )
                                }
                            </strong>

                        </div>

                    </div>


                    {/* ==================================
                        MAP + ROUTES
                    ================================== */}

                    <div className="route-results-layout">


                        {/* MAP */}

                        <div className="route-map-card">

                            <MapContainer
                                center={[
                                    routeData
                                        .origin
                                        .latitude,

                                    routeData
                                        .origin
                                        .longitude
                                ]}
                                zoom={9}
                                scrollWheelZoom={true}
                                style={{
                                    height: "100%",
                                    width: "100%"
                                }}
                            >

                                <TileLayer
                                    attribution="&copy; OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />


                                <RouteMapController
                                    route={
                                        selectedRoute
                                    }
                                />


                                {/* Routes */}

                                {routeData.routes.map(
                                    (
                                        route,
                                        index
                                    ) => {

                                        const points =
                                            route
                                                .geometry
                                                .coordinates
                                                .map(
                                                    (
                                                        point
                                                    ) => [
                                                        point[1],
                                                        point[0]
                                                    ]
                                                );

                                        return (

                                            <Polyline
                                                key={
                                                    index
                                                }
                                                positions={
                                                    points
                                                }
                                                pathOptions={{
                                                    weight:
                                                        route.isRecommended
                                                            ? 7
                                                            : 4,

                                                    opacity:
                                                        route.isRecommended
                                                            ? 0.9
                                                            : 0.45
                                                }}
                                                eventHandlers={{
                                                    click:
                                                        () =>
                                                            setSelectedRoute(
                                                                route
                                                            )
                                                }}
                                            />

                                        );

                                    }
                                )}


                                {/* Origin marker */}

                                <Marker
                                    position={[
                                        routeData
                                            .origin
                                            .latitude,

                                        routeData
                                            .origin
                                            .longitude
                                    ]}
                                >

                                    <Popup>

                                        <strong>
                                            Origin
                                        </strong>

                                        <br />

                                        {
                                            routeData
                                                .origin
                                                .displayName
                                        }

                                    </Popup>

                                </Marker>


                                {/* Destination marker */}

                                <Marker
                                    position={[
                                        routeData
                                            .destination
                                            .latitude,

                                        routeData
                                            .destination
                                            .longitude
                                    ]}
                                >

                                    <Popup>

                                        <strong>
                                            Destination
                                        </strong>

                                        <br />

                                        {
                                            routeData
                                                .destination
                                                .displayName
                                        }

                                    </Popup>

                                </Marker>

                            </MapContainer>

                        </div>


                        {/* ROUTE OPTIONS */}

                        <div className="route-options-card">

                            <div className="route-options-header">

                                <span>
                                    ROUTE OPTIONS
                                </span>

                                <h2>
                                    Recommended Routes
                                </h2>

                            </div>


                            {routeData.routes.map(
                                (
                                    route,
                                    index
                                ) => (

                                    <button
                                        key={index}
                                        className={
                                            selectedRoute ===
                                            route
                                                ? "route-option selected"
                                                : "route-option"
                                        }
                                        onClick={() =>
                                            setSelectedRoute(
                                                route
                                            )
                                        }
                                    >

                                        <div className="route-option-top">

                                            <strong>
                                                Route{" "}
                                                {index + 1}
                                            </strong>


                                            {route.isRecommended && (

                                                <span className="recommended-badge">

                                                    RECOMMENDED

                                                </span>

                                            )}

                                        </div>


                                        <div className="route-option-stats">

                                            <span>

                                                <Route
                                                    size={15}
                                                />

                                                {
                                                    route.distanceKm
                                                }{" "}
                                                km

                                            </span>


                                            <span>

                                                <Clock
                                                    size={15}
                                                />

                                                {
                                                    route.durationMinutes
                                                }{" "}
                                                min

                                            </span>

                                        </div>


                                        <div className="route-safety-row">

                                            <ShieldCheck
                                                size={16}
                                            />

                                            <span>
                                                Safety
                                            </span>

                                            <strong
                                                className={
                                                    getSafetyClass(
                                                        route.safetyScore
                                                    )
                                                }
                                            >
                                                {
                                                    route.safetyScore
                                                }
                                                /100
                                            </strong>

                                        </div>


                                        {route
                                            .affectedIncidents
                                            .length >
                                            0 && (

                                            <div className="affected-route">

                                                <AlertTriangle
                                                    size={15}
                                                />

                                                <span>

                                                    {
                                                        route
                                                            .affectedIncidents
                                                            .length
                                                    }{" "}
                                                    incident(s)
                                                    affecting
                                                    route

                                                </span>

                                            </div>

                                        )}

                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* ==================================
                        SELECTED ROUTE
                    ================================== */}

                    {selectedRoute && (

                        <div className="selected-route-card">


                            <div>

                                <span className="section-label">
                                    SELECTED ROUTE
                                </span>

                                <h2>

                                    {
                                        selectedRoute
                                            .isRecommended
                                            ? "Safest Available Route"
                                            : "Alternative Route"
                                    }

                                </h2>

                            </div>


                            <div className="selected-route-metrics">


                                <div>

                                    <small>
                                        DISTANCE
                                    </small>

                                    <strong>
                                        {
                                            selectedRoute
                                                .distanceKm
                                        }{" "}
                                        km
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        EST. TIME
                                    </small>

                                    <strong>
                                        {
                                            selectedRoute
                                                .durationMinutes
                                        }{" "}
                                        min
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        SAFETY
                                    </small>

                                    <strong
                                        className={
                                            getSafetyClass(
                                                selectedRoute
                                                    .safetyScore
                                            )
                                        }
                                    >
                                        {
                                            selectedRoute
                                                .safetyScore
                                        }
                                        /100
                                    </strong>

                                </div>

                            </div>


                            {/* Risk factors */}

                            {selectedRoute
                                .affectedIncidents
                                .length >
                                0 && (

                                <div className="route-incidents">

                                    <h3>
                                        ⚠️ Route Risk Factors
                                    </h3>


                                    {selectedRoute
                                        .affectedIncidents
                                        .map(
                                            (
                                                incident
                                            ) => (

                                                <div
                                                    className="route-incident"
                                                    key={
                                                        incident.id
                                                    }
                                                >

                                                    <AlertTriangle
                                                        size={17}
                                                    />

                                                    <div>

                                                        <strong>
                                                            {
                                                                incident
                                                                    .title
                                                            }
                                                        </strong>

                                                        <span>

                                                            {
                                                                incident
                                                                    .roadName
                                                            }

                                                            {" • "}

                                                            {
                                                                incident
                                                                    .severity
                                                            }

                                                            {" • "}

                                                            {
                                                                incident
                                                                    .distanceKm
                                                            }{" "}
                                                            km from
                                                            route

                                                        </span>

                                                    </div>

                                                </div>

                                            )
                                        )}

                                </div>

                            )}

                        </div>

                    )}

                </>

            )}

        </div>
    );
}

export default RoutePlanner;