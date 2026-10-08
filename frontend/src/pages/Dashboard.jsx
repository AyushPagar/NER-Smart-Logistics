import { useEffect, useState } from "react";

import {
    AlertTriangle,
    ShieldCheck,
    Activity,
    Route,
    ArrowUpRight,
    RefreshCw
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";


function Dashboard() {

    const [stats, setStats] = useState({

        total: 0,

        active: 0,

        critical: 0,

        high: 0,

        verified: 0,

        pending: 0,

        resolved: 0,

        routeSafety: 100

    });


    const [incidents, setIncidents] = useState([]);

    const [loading, setLoading] = useState(true);


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    const loadDashboard = async () => {

        try {

            setLoading(true);


            const statsResponse =
                await api.get(
                    "/incidents/stats/summary"
                );


            const incidentsResponse =
                await api.get(
                    "/incidents"
                );


            setStats(
                statsResponse.data.data
            );


            setIncidents(
                incidentsResponse.data.data || []
            );


        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    // ==========================================
    // SEVERITY CLASS
    // ==========================================

    const getIncidentStatusClass = (
        severity
    ) => {

        if (
            severity === "CRITICAL" ||
            severity === "HIGH"
        ) {

            return "incident-status critical";

        }


        if (severity === "MEDIUM") {

            return "incident-status warning";

        }


        return "incident-status safe";

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
                                Regional Operations
                            </h2>

                            <p>
                                Monitor road accessibility,
                                incidents and logistics risk
                                across the North Eastern Region.
                            </p>

                        </div>


                        <button
                            className="primary-button"
                            onClick={loadDashboard}
                        >

                            <RefreshCw size={15} />

                            Refresh

                        </button>

                    </div>


                    {/* KPI CARDS */}

                    <div className="stats-grid">


                        {/* ACTIVE */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon blue">

                                    <Activity
                                        size={20}
                                    />

                                </div>


                                <span className="trend positive">

                                    <ArrowUpRight
                                        size={15}
                                    />

                                    Live

                                </span>

                            </div>


                            <p>
                                Active Incidents
                            </p>


                            <h3>

                                {loading
                                    ? "..."
                                    : stats.active}

                            </h3>


                            <span className="stat-description">

                                Pending + verified incidents

                            </span>

                        </div>


                        {/* CRITICAL */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon red">

                                    <AlertTriangle
                                        size={20}
                                    />

                                </div>


                                <span className="trend negative">

                                    Attention

                                </span>

                            </div>


                            <p>
                                Critical Roads
                            </p>


                            <h3>

                                {loading
                                    ? "..."
                                    : stats.critical}

                            </h3>


                            <span className="stat-description">

                                Critical incidents requiring action

                            </span>

                        </div>


                        {/* VERIFIED */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon green">

                                    <ShieldCheck
                                        size={20}
                                    />

                                </div>


                                <span className="trend positive">

                                    Verified

                                </span>

                            </div>


                            <p>
                                Verified Reports
                            </p>


                            <h3>

                                {loading
                                    ? "..."
                                    : stats.verified}

                            </h3>


                            <span className="stat-description">

                                Reports verified by operations

                            </span>

                        </div>


                        {/* ROUTE SAFETY */}

                        <div className="stat-card">

                            <div className="stat-top">

                                <div className="stat-icon purple">

                                    <Route
                                        size={20}
                                    />

                                </div>


                                <span className="trend positive">

                                    Score

                                </span>

                            </div>


                            <p>
                                Route Safety
                            </p>


                            <h3>

                                {loading
                                    ? "..."
                                    : `${stats.routeSafety}%`}

                            </h3>


                            <span className="stat-description">

                                Current regional accessibility score

                            </span>

                        </div>

                    </div>


                    {/* MAIN CONTENT */}

                    <div className="dashboard-grid">


                        {/* MAP */}

                        <div className="map-card">


                            <div className="card-header">


                                <div>

                                    <h3>
                                        Regional Risk Map
                                    </h3>

                                    <p>
                                        Live MongoDB incident overview
                                    </p>

                                </div>


                                <a
                                    href="/map"
                                    className="outline-button"
                                >

                                    View Full Map

                                </a>

                            </div>


                            <div className="map-placeholder">


                                <div className="map-grid"></div>


                                <div className="map-center">

                                    <Route size={30} />

                                    <span>
                                        Regional Operations Map
                                    </span>

                                    <small>
                                        Open Live Map to view
                                        incident locations
                                    </small>

                                </div>


                                {/* MARKERS */}

                                {incidents
                                    .slice(0, 6)
                                    .map(
                                        (
                                            incident,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    incident._id
                                                }
                                                className={
                                                    `map-marker ${
                                                        incident.severity ===
                                                        "CRITICAL"
                                                            ? "marker-red"
                                                            : incident.severity ===
                                                                "HIGH"
                                                                ? "marker-red"
                                                                : incident.severity ===
                                                                    "MEDIUM"
                                                                    ? "marker-orange"
                                                                    : "marker-green"
                                                    }`
                                                }
                                                style={{
                                                    left:
                                                        `${25 +
                                                            (
                                                                index *
                                                                11
                                                            )}%`,

                                                    top:
                                                        `${30 +
                                                            (
                                                                index %
                                                                3
                                                            ) *
                                                            20}%`
                                                }}
                                            >

                                                <span></span>

                                            </div>

                                        )
                                    )}

                            </div>

                        </div>


                        {/* LIVE INCIDENTS */}

                        <div className="incident-card">


                            <div className="card-header">


                                <div>

                                    <h3>
                                        Live Incidents
                                    </h3>

                                    <p>
                                        Latest field reports
                                    </p>

                                </div>


                                <a
                                    href="/incidents"
                                    className="text-button"
                                >
                                    View all
                                </a>

                            </div>


                            <div className="incident-list">


                                {incidents.length === 0 && (

                                    <div
                                        style={{
                                            padding:
                                                "30px",
                                            textAlign:
                                                "center",
                                            color:
                                                "#94a3b8",
                                            fontSize:
                                                "11px"
                                        }}
                                    >

                                        No incidents reported.

                                    </div>

                                )}


                                {incidents
                                    .slice(0, 5)
                                    .map(
                                        (
                                            incident
                                        ) => (

                                            <div
                                                className="incident-item"
                                                key={
                                                    incident._id
                                                }
                                            >


                                                <div
                                                    className={
                                                        getIncidentStatusClass(
                                                            incident.severity
                                                        )
                                                    }
                                                >

                                                    <AlertTriangle
                                                        size={14}
                                                    />

                                                </div>


                                                <div className="incident-info">


                                                    <strong>

                                                        {
                                                            incident.title
                                                        }

                                                    </strong>


                                                    <span>

                                                        {
                                                            incident.roadName
                                                        }

                                                        {" · "}

                                                        {
                                                            incident.district
                                                        }

                                                        {", "}

                                                        {
                                                            incident.state
                                                        }

                                                    </span>


                                                </div>


                                                <span
                                                    className={
                                                        incident.severity ===
                                                            "CRITICAL" ||
                                                        incident.severity ===
                                                            "HIGH"
                                                            ? "severity high"
                                                            : incident.severity ===
                                                                "MEDIUM"
                                                                ? "severity medium"
                                                                : "severity resolved"
                                                    }
                                                >

                                                    {
                                                        incident.severity
                                                    }

                                                </span>

                                            </div>

                                        )
                                    )}

                            </div>

                        </div>

                    </div>


                    {/* LOWER SUMMARY */}

                    <div
                        style={{
                            display:
                                "grid",

                            gridTemplateColumns:
                                "repeat(4, 1fr)",

                            gap: "15px",

                            marginTop:
                                "20px"
                        }}
                    >


                        <div className="stat-card">

                            <p>
                                Total Reports
                            </p>

                            <h3>
                                {stats.total}
                            </h3>

                            <span className="stat-description">
                                All incidents recorded
                            </span>

                        </div>


                        <div className="stat-card">

                            <p>
                                High Risk
                            </p>

                            <h3>
                                {stats.high}
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
                                {stats.pending}
                            </h3>

                            <span className="stat-description">
                                Awaiting verification
                            </span>

                        </div>


                        <div className="stat-card">

                            <p>
                                Resolved
                            </p>

                            <h3>
                                {stats.resolved}
                            </h3>

                            <span className="stat-description">
                                Closed incidents
                            </span>

                        </div>


                    </div>

                </section>

            </main>

        </div>
    );
}


export default Dashboard;