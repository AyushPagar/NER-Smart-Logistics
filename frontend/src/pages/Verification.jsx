import { useEffect, useState } from "react";

import {
    ShieldCheck,
    XCircle,
    CheckCircle,
    RefreshCw,
    AlertTriangle,
    Clock,
    Search
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";


function Verification() {

    const [incidents, setIncidents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState("");

    const [search, setSearch] = useState("");

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    const loadIncidents = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get("/incidents");

            setIncidents(
                response.data.data || []
            );

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load incident reports."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadIncidents();

    }, []);


    const updateIncident = async (
        id,
        action
    ) => {

        try {

            setActionLoading(id);

            setMessage("");

            setError("");

            await api.put(
                `/incidents/${id}/${action}`
            );

            setMessage(
                `Incident ${action}ed successfully.`
            );

            await loadIncidents();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update incident."
            );

        } finally {

            setActionLoading("");

        }

    };


    const pendingIncidents =
        incidents.filter(
            (incident) =>
                incident.status === "PENDING"
        );


    const verifiedIncidents =
        incidents.filter(
            (incident) =>
                incident.status === "VERIFIED"
        );


    const rejectedIncidents =
        incidents.filter(
            (incident) =>
                incident.status === "REJECTED"
        );


    const filteredIncidents =
        pendingIncidents.filter(
            (incident) => {

                const value =
                    search.toLowerCase();

                return (
                    incident.title
                        ?.toLowerCase()
                        .includes(value) ||

                    incident.roadName
                        ?.toLowerCase()
                        .includes(value) ||

                    incident.district
                        ?.toLowerCase()
                        .includes(value) ||

                    incident.state
                        ?.toLowerCase()
                        .includes(value)
                );

            }
        );


    const getSeverityClass =
        (severity) => {

            if (
                severity === "CRITICAL"
            ) {
                return "verification-severity critical";
            }

            if (
                severity === "HIGH"
            ) {
                return "verification-severity high";
            }

            if (
                severity === "MEDIUM"
            ) {
                return "verification-severity medium";
            }

            return "verification-severity low";

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
                                Incident Verification
                            </h2>

                            <p>
                                Review field reports and
                                validate road incidents.
                            </p>

                        </div>


                        <button
                            className="primary-button"
                            onClick={
                                loadIncidents
                            }
                        >

                            <RefreshCw
                                size={15}
                            />

                            Refresh

                        </button>

                    </div>


                    {message && (

                        <div className="verification-message success">

                            <CheckCircle
                                size={17}
                            />

                            {message}

                        </div>

                    )}


                    {error && (

                        <div className="verification-message error">

                            <AlertTriangle
                                size={17}
                            />

                            {error}

                        </div>

                    )}


                    {/* SUMMARY */}

                    <div className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon blue">

                                    <Clock
                                        size={20}
                                    />

                                </div>

                            </div>

                            <p>
                                Pending Review
                            </p>

                            <h3>
                                {pendingIncidents.length}
                            </h3>

                            <span className="stat-description">
                                Reports awaiting verification
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon green">

                                    <ShieldCheck
                                        size={20}
                                    />

                                </div>

                            </div>

                            <p>
                                Verified
                            </p>

                            <h3>
                                {verifiedIncidents.length}
                            </h3>

                            <span className="stat-description">
                                Approved incidents
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon red">

                                    <XCircle
                                        size={20}
                                    />

                                </div>

                            </div>

                            <p>
                                Rejected
                            </p>

                            <h3>
                                {rejectedIncidents.length}
                            </h3>

                            <span className="stat-description">
                                Invalid reports
                            </span>

                        </div>


                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon purple">

                                    <AlertTriangle
                                        size={20}
                                    />

                                </div>

                            </div>

                            <p>
                                Critical Pending
                            </p>

                            <h3>

                                {
                                    pendingIncidents.filter(
                                        (incident) =>
                                            incident.severity ===
                                            "CRITICAL"
                                    ).length
                                }

                            </h3>

                            <span className="stat-description">
                                Requires immediate attention
                            </span>

                        </div>

                    </div>


                    {/* SEARCH */}

                    <div
                        className="map-card"
                        style={{
                            marginBottom: "18px"
                        }}
                    >

                        <div
                            style={{
                                padding: "14px 18px"
                            }}
                        >

                            <div className="verification-search">

                                <Search
                                    size={16}
                                />

                                <input
                                    type="text"
                                    placeholder="Search pending incidents..."
                                    value={search}
                                    onChange={
                                        (event) =>
                                            setSearch(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* INCIDENTS */}

                    <div className="verification-grid">

                        {loading && (

                            <div className="empty-verification">

                                Loading incident reports...

                            </div>

                        )}


                        {!loading &&
                            filteredIncidents.length === 0 && (

                                <div className="empty-verification">

                                    <CheckCircle
                                        size={30}
                                    />

                                    <strong>
                                        No pending incidents
                                    </strong>

                                    <span>
                                        All field reports have
                                        been reviewed.
                                    </span>

                                </div>

                            )}


                        {!loading &&
                            filteredIncidents.map(
                                (incident) => (

                                    <div
                                        className="verification-card"
                                        key={
                                            incident._id
                                        }
                                    >

                                        <div className="verification-card-top">

                                            <div>

                                                <span
                                                    className={
                                                        getSeverityClass(
                                                            incident.severity
                                                        )
                                                    }
                                                >
                                                    {
                                                        incident.severity
                                                    }
                                                </span>

                                            </div>

                                            <span className="pending-badge">

                                                PENDING

                                            </span>

                                        </div>


                                        <h3>
                                            {
                                                incident.title
                                            }
                                        </h3>


                                        <p className="verification-description">

                                            {
                                                incident.description
                                            }

                                        </p>


                                        <div className="verification-details">

                                            <div>

                                                <span>
                                                    Road
                                                </span>

                                                <strong>
                                                    {
                                                        incident.roadName
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Location
                                                </span>

                                                <strong>
                                                    {
                                                        incident.district
                                                    },
                                                    {" "}
                                                    {
                                                        incident.state
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Type
                                                </span>

                                                <strong>
                                                    {
                                                        incident.incidentType
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Reported By
                                                </span>

                                                <strong>
                                                    {
                                                        incident.reportedBy
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="verification-actions">

                                            <button
                                                className="verify-button"
                                                disabled={
                                                    actionLoading ===
                                                    incident._id
                                                }
                                                onClick={() =>
                                                    updateIncident(
                                                        incident._id,
                                                        "verify"
                                                    )
                                                }
                                            >

                                                <CheckCircle
                                                    size={15}
                                                />

                                                Verify

                                            </button>


                                            <button
                                                className="reject-button"
                                                disabled={
                                                    actionLoading ===
                                                    incident._id
                                                }
                                                onClick={() =>
                                                    updateIncident(
                                                        incident._id,
                                                        "reject"
                                                    )
                                                }
                                            >

                                                <XCircle
                                                    size={15}
                                                />

                                                Reject

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                    </div>

                </section>

            </main>

        </div>
    );
}


export default Verification;