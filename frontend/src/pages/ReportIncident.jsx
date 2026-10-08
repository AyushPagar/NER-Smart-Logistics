import { useState } from "react";

import {
    AlertTriangle,
    MapPin,
    Camera,
    Send,
    Navigation,
    CheckCircle,
    Loader2
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

function ReportIncident() {

    const [form, setForm] = useState({
        title: "",
        description: "",
        incidentType: "",
        severity: "MEDIUM",
        latitude: "",
        longitude: "",
        state: "",
        district: "",
        roadName: "",
        reportedBy: ""
    });

    const [photo, setPhoto] = useState(null);

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState("");

    const [error, setError] = useState("");

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    const getCurrentLocation = () => {

        setError("");

        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by your browser."
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setForm((previous) => ({
                    ...previous,

                    latitude:
                        position.coords.latitude.toFixed(6),

                    longitude:
                        position.coords.longitude.toFixed(6)
                }));

            },

            () => {

                setError(
                    "Unable to access your location. Please enter coordinates manually."
                );

            }

        );

    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);

        setSuccess("");

        setError("");

        try {

            const payload = {

                title: form.title,

                description: form.description,

                incidentType: form.incidentType,

                severity: form.severity,

                location: {
                    latitude:
                        Number(form.latitude),

                    longitude:
                        Number(form.longitude)
                },

                state: form.state,

                district: form.district,

                roadName: form.roadName,

                reportedBy:
                    form.reportedBy || "Field Reporter"

            };

            await api.post(
                "/incidents",
                payload
            );

            setSuccess(
                "Incident reported successfully."
            );

            setForm({
                title: "",
                description: "",
                incidentType: "",
                severity: "MEDIUM",
                latitude: "",
                longitude: "",
                state: "",
                district: "",
                roadName: "",
                reportedBy: ""
            });

            setPhoto(null);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to submit incident."
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="app">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <section className="dashboard">

                    <div className="welcome-row">

                        <div>

                            <h2>
                                Report Incident
                            </h2>

                            <p>
                                Submit a road or accessibility
                                incident for verification.
                            </p>

                        </div>

                    </div>

                    {success && (

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "14px 18px",
                                marginBottom: "20px",
                                background: "#ecfdf5",
                                border: "1px solid #bbf7d0",
                                borderRadius: "10px",
                                color: "#166534",
                                fontSize: "13px"
                            }}
                        >

                            <CheckCircle size={18} />

                            {success}

                        </div>

                    )}

                    {error && (

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "14px 18px",
                                marginBottom: "20px",
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: "10px",
                                color: "#b91c1c",
                                fontSize: "13px"
                            }}
                        >

                            <AlertTriangle size={18} />

                            {error}

                        </div>

                    )}

                    <form
                        onSubmit={handleSubmit}
                    >

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "minmax(0, 2fr) minmax(280px, 1fr)",
                                gap: "20px"
                            }}
                        >

                            {/* LEFT COLUMN */}

                            <div>

                                <div
                                    className="map-card"
                                    style={{
                                        marginBottom: "20px"
                                    }}
                                >

                                    <div className="card-header">

                                        <div>

                                            <h3>
                                                Incident Information
                                            </h3>

                                            <p>
                                                Provide details about
                                                the reported problem.
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            padding: "20px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr",
                                                gap: "18px"
                                            }}
                                        >

                                            <div>

                                                <label className="form-label">
                                                    Incident Title
                                                </label>

                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    name="title"
                                                    value={form.title}
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="e.g. Road blocked by landslide"
                                                    required
                                                />

                                            </div>

                                            <div>

                                                <label className="form-label">
                                                    Road Name
                                                </label>

                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    name="roadName"
                                                    value={form.roadName}
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="e.g. NH-27"
                                                    required
                                                />

                                            </div>

                                        </div>

                                        <div
                                            style={{
                                                marginTop: "18px"
                                            }}
                                        >

                                            <label className="form-label">
                                                Description
                                            </label>

                                            <textarea
                                                className="form-input"
                                                name="description"
                                                value={
                                                    form.description
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Describe what happened, road condition, accessibility impact, etc."
                                                rows="5"
                                                required
                                                style={{
                                                    resize: "vertical"
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* INCIDENT TYPE */}

                                <div
                                    className="map-card"
                                    style={{
                                        marginBottom: "20px"
                                    }}
                                >

                                    <div className="card-header">

                                        <div>

                                            <h3>
                                                Incident Type
                                            </h3>

                                            <p>
                                                Select the category
                                                that best describes
                                                the incident.
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            padding: "20px",
                                            display: "grid",
                                            gridTemplateColumns:
                                                "repeat(4, 1fr)",
                                            gap: "12px"
                                        }}
                                    >

                                        {[
                                            {
                                                value: "ACCIDENT",
                                                label: "Accident",
                                                icon: "🚗"
                                            },
                                            {
                                                value: "FLOOD",
                                                label: "Flood",
                                                icon: "🌊"
                                            },
                                            {
                                                value: "LANDSLIDE",
                                                label: "Landslide",
                                                icon: "⛰️"
                                            },
                                            {
                                                value: "ROAD_DAMAGE",
                                                label: "Road Damage",
                                                icon: "🛣️"
                                            },
                                            {
                                                value: "TRAFFIC",
                                                label: "Traffic",
                                                icon: "🚦"
                                            },
                                            {
                                                value: "ROAD_BLOCKED",
                                                label: "Road Blocked",
                                                icon: "🚧"
                                            },
                                            {
                                                value: "WEATHER",
                                                label: "Weather",
                                                icon: "🌧️"
                                            },
                                            {
                                                value: "OTHER",
                                                label: "Other",
                                                icon: "⚠️"
                                            }
                                        ].map((type) => (

                                            <button
                                                type="button"
                                                key={type.value}
                                                onClick={() =>
                                                    setForm(
                                                        (previous) => ({
                                                            ...previous,
                                                            incidentType:
                                                                type.value
                                                        })
                                                    )
                                                }
                                                style={{
                                                    padding:
                                                        "16px 10px",
                                                    borderRadius:
                                                        "10px",
                                                    border:
                                                        form.incidentType ===
                                                        type.value
                                                            ? "2px solid #2563eb"
                                                            : "1px solid #e2e8f0",
                                                    background:
                                                        form.incidentType ===
                                                        type.value
                                                            ? "#eff6ff"
                                                            : "#ffffff",
                                                    cursor: "pointer",
                                                    textAlign:
                                                        "center"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "24px",
                                                        marginBottom:
                                                            "7px"
                                                    }}
                                                >
                                                    {type.icon}
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize:
                                                            "11px",
                                                        fontWeight:
                                                            "600",
                                                        color:
                                                            "#334155"
                                                    }}
                                                >
                                                    {type.label}
                                                </div>

                                            </button>

                                        ))}

                                    </div>

                                </div>


                                {/* LOCATION */}

                                <div
                                    className="map-card"
                                >

                                    <div className="card-header">

                                        <div>

                                            <h3>
                                                Incident Location
                                            </h3>

                                            <p>
                                                Add the location where
                                                the incident occurred.
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            className="outline-button"
                                            onClick={
                                                getCurrentLocation
                                            }
                                        >

                                            <Navigation
                                                size={14}
                                            />

                                            Use My Location

                                        </button>

                                    </div>

                                    <div
                                        style={{
                                            padding: "20px"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr",
                                                gap: "18px"
                                            }}
                                        >

                                            <div>

                                                <label className="form-label">
                                                    Latitude
                                                </label>

                                                <input
                                                    className="form-input"
                                                    type="number"
                                                    step="any"
                                                    name="latitude"
                                                    value={
                                                        form.latitude
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="26.1445"
                                                    required
                                                />

                                            </div>

                                            <div>

                                                <label className="form-label">
                                                    Longitude
                                                </label>

                                                <input
                                                    className="form-input"
                                                    type="number"
                                                    step="any"
                                                    name="longitude"
                                                    value={
                                                        form.longitude
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="91.7362"
                                                    required
                                                />

                                            </div>

                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "1fr 1fr",
                                                gap: "18px",
                                                marginTop: "18px"
                                            }}
                                        >

                                            <div>

                                                <label className="form-label">
                                                    State
                                                </label>

                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    name="state"
                                                    value={
                                                        form.state
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Assam"
                                                    required
                                                />

                                            </div>

                                            <div>

                                                <label className="form-label">
                                                    District
                                                </label>

                                                <input
                                                    className="form-input"
                                                    type="text"
                                                    name="district"
                                                    value={
                                                        form.district
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Kamrup"
                                                    required
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* RIGHT COLUMN */}

                            <div>

                                {/* SEVERITY */}

                                <div
                                    className="map-card"
                                    style={{
                                        marginBottom: "20px"
                                    }}
                                >

                                    <div className="card-header">

                                        <div>

                                            <h3>
                                                Severity
                                            </h3>

                                            <p>
                                                How serious is the
                                                incident?
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            padding: "20px"
                                        }}
                                    >

                                        {[
                                            {
                                                value: "LOW",
                                                label: "Low",
                                                description:
                                                    "Minor issue"
                                            },
                                            {
                                                value: "MEDIUM",
                                                label: "Medium",
                                                description:
                                                    "Partial disruption"
                                            },
                                            {
                                                value: "HIGH",
                                                label: "High",
                                                description:
                                                    "Major disruption"
                                            },
                                            {
                                                value: "CRITICAL",
                                                label: "Critical",
                                                description:
                                                    "Road/access blocked"
                                            }
                                        ].map(
                                            (level) => (

                                                <button
                                                    type="button"
                                                    key={
                                                        level.value
                                                    }
                                                    onClick={() =>
                                                        setForm(
                                                            (
                                                                previous
                                                            ) => ({
                                                                ...previous,
                                                                severity:
                                                                    level.value
                                                            })
                                                        )
                                                    }
                                                    style={{
                                                        width:
                                                            "100%",
                                                        padding:
                                                            "13px",
                                                        marginBottom:
                                                            "9px",
                                                        borderRadius:
                                                            "8px",
                                                        border:
                                                            form.severity ===
                                                            level.value
                                                                ? "2px solid #2563eb"
                                                                : "1px solid #e2e8f0",
                                                        background:
                                                            form.severity ===
                                                            level.value
                                                                ? "#eff6ff"
                                                                : "#ffffff",
                                                        cursor:
                                                            "pointer",
                                                        textAlign:
                                                            "left"
                                                    }}
                                                >

                                                    <strong
                                                        style={{
                                                            display:
                                                                "block",
                                                            fontSize:
                                                                "12px",
                                                            color:
                                                                "#1e293b"
                                                        }}
                                                    >
                                                        {level.label}
                                                    </strong>

                                                    <span
                                                        style={{
                                                            fontSize:
                                                                "10px",
                                                            color:
                                                                "#64748b"
                                                        }}
                                                    >
                                                        {
                                                            level.description
                                                        }
                                                    </span>

                                                </button>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* PHOTO */}

                                <div
                                    className="map-card"
                                    style={{
                                        marginBottom: "20px"
                                    }}
                                >

                                    <div className="card-header">

                                        <div>

                                            <h3>
                                                Evidence
                                            </h3>

                                            <p>
                                                Attach a photo if
                                                available.
                                            </p>

                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            padding: "20px"
                                        }}
                                    >

                                        <label
                                            style={{
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                minHeight:
                                                    "150px",
                                                border:
                                                    "2px dashed #cbd5e1",
                                                borderRadius:
                                                    "10px",
                                                cursor:
                                                    "pointer",
                                                background:
                                                    "#f8fafc"
                                            }}
                                        >

                                            <Camera
                                                size={30}
                                                color="#64748b"
                                            />

                                            <strong
                                                style={{
                                                    marginTop:
                                                        "10px",
                                                    fontSize:
                                                        "12px"
                                                }}
                                            >
                                                {photo
                                                    ? photo.name
                                                    : "Upload incident photo"}
                                            </strong>

                                            <span
                                                style={{
                                                    marginTop:
                                                        "5px",
                                                    fontSize:
                                                        "10px",
                                                    color:
                                                        "#94a3b8"
                                                }}
                                            >
                                                JPG, PNG up to
                                                10MB
                                            </span>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(
                                                    event
                                                ) =>
                                                    setPhoto(
                                                        event
                                                            .target
                                                            .files?.[0] ||
                                                        null
                                                    )
                                                }
                                            />

                                        </label>

                                    </div>

                                </div>


                                {/* REPORTER */}

                                <div
                                    className="map-card"
                                >

                                    <div className="card-header">

                                        <div>

                                            <h3>
                                                Reporter
                                            </h3>

                                        </div>

                                    </div>

                                    <div
                                        style={{
                                            padding: "20px"
                                        }}
                                    >

                                        <label className="form-label">
                                            Reporter Name
                                        </label>

                                        <input
                                            className="form-input"
                                            type="text"
                                            name="reportedBy"
                                            value={
                                                form.reportedBy
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Field Reporter"
                                        />

                                        <button
                                            type="submit"
                                            className="primary-button"
                                            disabled={loading}
                                            style={{
                                                width: "100%",
                                                justifyContent:
                                                    "center",
                                                marginTop:
                                                    "18px"
                                            }}
                                        >

                                            {loading ? (
                                                <>
                                                    <Loader2
                                                        size={15}
                                                        className="spin"
                                                    />

                                                    Submitting...

                                                </>
                                            ) : (
                                                <>
                                                    <Send
                                                        size={15}
                                                    />

                                                    Submit Incident

                                                </>
                                            )}

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
}

export default ReportIncident;