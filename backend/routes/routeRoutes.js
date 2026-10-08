const express = require("express");
const RoadIncident = require("../models/RoadIncident");

const router = express.Router();

// Calculate distance between two coordinates in KM
function distanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

// Geocode city/place using OpenStreetMap
async function geocode(place) {
    const url =
        `https://nominatim.openstreetmap.org/search` +
        `?format=json` +
        `&limit=1` +
        `&q=${encodeURIComponent(place)}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "NER-Smart-Logistics-Student-Project/1.0"
        }
    });

    if (!response.ok) {
        throw new Error("Geocoding service failed");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
        return null;
    }

    return {
        latitude: Number(data[0].lat),
        longitude: Number(data[0].lon),
        displayName: data[0].display_name
    };
}

// Severity penalty
function getSeverityPenalty(severity) {
    switch (severity) {
        case "CRITICAL":
            return 35;

        case "HIGH":
            return 25;

        case "MEDIUM":
            return 12;

        case "LOW":
            return 5;

        default:
            return 0;
    }
}

// POST /api/routes/smart
router.post("/smart", async (req, res) => {
    try {
        const { origin, destination } = req.body;

        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                message:
                    "Origin and destination are required"
            });
        }

        // ----------------------------------------
        // Geocode origin
        // ----------------------------------------

        const originLocation =
            await geocode(origin);

        if (!originLocation) {
            return res.status(404).json({
                success: false,
                message:
                    `Could not find origin: ${origin}`
            });
        }

        // ----------------------------------------
        // Geocode destination
        // ----------------------------------------

        const destinationLocation =
            await geocode(destination);

        if (!destinationLocation) {
            return res.status(404).json({
                success: false,
                message:
                    `Could not find destination: ${destination}`
            });
        }

        // ----------------------------------------
        // OSRM routing
        // ----------------------------------------

        const coordinates =
            `${originLocation.longitude},${originLocation.latitude};` +
            `${destinationLocation.longitude},${destinationLocation.latitude}`;

        const routingUrl =
            `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
            `?alternatives=true` +
            `&overview=full` +
            `&geometries=geojson`;

        const routeResponse =
            await fetch(routingUrl);

        if (!routeResponse.ok) {
            throw new Error(
                "Routing service failed"
            );
        }

        const routeData =
            await routeResponse.json();

        if (
            routeData.code !== "Ok" ||
            !routeData.routes ||
            routeData.routes.length === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "No route could be found"
            });
        }

        // ----------------------------------------
        // Get verified incidents
        // ----------------------------------------

        const incidents =
            await RoadIncident.find({
                status: "VERIFIED"
            }).lean();

        // ----------------------------------------
        // Analyse routes
        // ----------------------------------------

        const analysedRoutes =
            routeData.routes.map(
                (route, routeIndex) => {

                    let riskPenalty = 0;

                    const affectedIncidents = [];

                    const routeCoordinates =
                        route.geometry.coordinates;

                    // Check every verified incident
                    for (const incident of incidents) {

                        let nearestDistance =
                            Infinity;

                        for (
                            const point of routeCoordinates
                        ) {
                            const distance =
                                distanceKm(
                                    incident.location.latitude,
                                    incident.location.longitude,
                                    point[1],
                                    point[0]
                                );

                            if (
                                distance <
                                nearestDistance
                            ) {
                                nearestDistance =
                                    distance;
                            }

                            if (distance <= 1.5) {
                                break;
                            }
                        }

                        // Incident affects route
                        if (
                            nearestDistance <= 1.5
                        ) {
                            const penalty =
                                getSeverityPenalty(
                                    incident.severity
                                );

                            riskPenalty += penalty;

                            affectedIncidents.push({
                                id: incident._id,
                                title: incident.title,
                                severity:
                                    incident.severity,
                                incidentType:
                                    incident.incidentType,
                                roadName:
                                    incident.roadName,
                                distanceKm:
                                    Number(
                                        nearestDistance.toFixed(
                                            2
                                        )
                                    ),
                                penalty
                            });
                        }
                    }

                    // --------------------------------
                    // Safety score
                    // --------------------------------

                    const safetyScore =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                100 - riskPenalty
                            )
                        );

                    return {
                        routeIndex,

                        distanceKm:
                            Number(
                                (
                                    route.distance /
                                    1000
                                ).toFixed(2)
                            ),

                        durationMinutes:
                            Number(
                                (
                                    route.duration /
                                    60
                                ).toFixed(1)
                            ),

                        safetyScore,

                        riskPenalty,

                        affectedIncidents,

                        geometry:
                            route.geometry,

                        isRecommended: false
                    };
                }
            );

        // ----------------------------------------
        // Recommended route
        // ----------------------------------------

        analysedRoutes.sort((a, b) => {
            if (
                b.safetyScore !==
                a.safetyScore
            ) {
                return (
                    b.safetyScore -
                    a.safetyScore
                );
            }

            return (
                a.distanceKm -
                b.distanceKm
            );
        });

        if (analysedRoutes.length > 0) {
            analysedRoutes[0]
                .isRecommended = true;
        }

        // ----------------------------------------
        // Response
        // ----------------------------------------

        res.json({
            success: true,

            origin: originLocation,

            destination:
                destinationLocation,

            routes: analysedRoutes,

            incidentsChecked:
                incidents.length,

            message:
                "Smart routes calculated successfully"
        });

    } catch (error) {
        console.error(
            "Smart route error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to calculate smart route",
            error: error.message
        });
    }
});

module.exports = router;