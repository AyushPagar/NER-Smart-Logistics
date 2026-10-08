const mongoose = require("mongoose");

const roadIncidentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        incidentType: {
            type: String,
            enum: [
                "ACCIDENT",
                "FLOOD",
                "LANDSLIDE",
                "ROAD_DAMAGE",
                "TRAFFIC",
                "ROAD_BLOCKED",
                "WEATHER",
                "OTHER"
            ],
            required: true
        },

        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "LOW"
        },

        location: {
            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        },

        state: {
            type: String,
            required: true
        },

        district: {
            type: String,
            required: true
        },

        roadName: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "VERIFIED",
                "RESOLVED",
                "REJECTED"
            ],
            default: "PENDING"
        },

        reportedBy: {
            type: String,
            default: "Anonymous"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "RoadIncident",
    roadIncidentSchema
);