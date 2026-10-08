import { useEffect, useState } from "react";

import {
    AlertTriangle,
    Search,
    Filter,
    RefreshCw
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";


function Incidents() {

    const [incidents, setIncidents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("ALL");


    // Fetch incidents from MongoDB
    const fetchIncidents = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get("/incidents");

            setIncidents(response.data.data || []);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to connect to the backend."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchIncidents();

    }, []);


    // Search + filter
    const filteredIncidents = incidents.filter(
        (incident) => {

            const searchText = search.toLowerCase();

            const matchesSearch =
                incident.title
                    ?.toLowerCase()
                    .includes(searchText) ||

                incident.roadName
                    ?.toLowerCase()
                    .includes(searchText) ||

                incident.district
                    ?.toLowerCase()
                    .includes(searchText) ||

                incident.state
                    ?.toLowerCase()
                    .includes(searchText);


            const matchesFilter =
                filter === "ALL" ||
                incident.severity === filter;


            return matchesSearch && matchesFilter;
        }
    );


    // Severity styling
    const getSeverityClass = (severity) => {

        switch (severity) {

            case "CRITICAL":
                return "high";

            case "HIGH":
                return "high";

            case "MEDIUM":
                return "medium";

            case "LOW":
                return "resolved";

            default:
                return "resolved";
        }
    };


    return (

        <div className="app">

            <Sidebar />


            <main className="main-content">

                <Topbar />


                <section className="dashboard">


                    {/* PAGE HEADER */}

                    <div className="welcome-row">

                        <div>

                            <h2>
                                Road Incidents
                            </h2>

                            <p>
                                Monitor and manage reported
                                incidents across NER.
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


                    {/* INCIDENT REGISTRY */}

                    <div className="map-card">


                        {/* HEADER */}

                        <div className="card-header">

                            <div>

                                <h3>
                                    Incident Registry
                                </h3>

                                <p>
                                    {incidents.length} incidents
                                    retrieved from MongoDB
                                </p>

                            </div>


                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center"
                                }}
                            >

                                {/* SEARCH */}

                                <div className="search-box">

                                    <Search size={15} />

                                    <input
                                        type="text"
                                        placeholder="Search incidents..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* FILTER */}

                                <select
                                    value={filter}
                                    onChange={(e) =>
                                        setFilter(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        height: "38px",
                                        border:
                                            "1px solid #e2e8f0",
                                        borderRadius: "9px",
                                        padding:
                                            "0 10px",
                                        fontSize: "11px",
                                        color:
                                            "#475569",
                                        background:
                                            "#ffffff",
                                        outline: "none"
                                    }}
                                >

                                    <option value="ALL">
                                        All Severity
                                    </option>

                                    <option value="CRITICAL">
                                        Critical
                                    </option>

                                    <option value="HIGH">
                                        High
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="LOW">
                                        Low
                                    </option>

                                </select>


                                <button
                                    className="outline-button"
                                    onClick={fetchIncidents}
                                >

                                    <Filter size={13} />

                                    Refresh

                                </button>

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div
                                style={{
                                    padding: "15px 20px",
                                    background:
                                        "#fef2f2",
                                    color:
                                        "#dc2626",
                                    fontSize: "12px"
                                }}
                            >

                                <AlertTriangle
                                    size={14}
                                    style={{
                                        verticalAlign:
                                            "middle",
                                        marginRight:
                                            "6px"
                                    }}
                                />

                                {error}

                            </div>

                        )}


                        {/* LOADING */}

                        {loading && (

                            <div
                                style={{
                                    padding: "40px",
                                    textAlign:
                                        "center",
                                    color:
                                        "#64748b",
                                    fontSize:
                                        "12px"
                                }}
                            >

                                Loading incidents...

                            </div>

                        )}


                        {/* NO INCIDENTS */}

                        {!loading &&
                            !error &&
                            filteredIncidents.length === 0 && (

                                <div
                                    style={{
                                        padding:
                                            "60px 20px",
                                        textAlign:
                                            "center",
                                        color:
                                            "#94a3b8"
                                    }}
                                >

                                    <AlertTriangle
                                        size={32}
                                        style={{
                                            marginBottom:
                                                "10px"
                                        }}
                                    />

                                    <p>
                                        No incidents found.
                                    </p>

                                </div>

                            )}


                        {/* INCIDENT LIST */}

                        {!loading &&
                            filteredIncidents.length > 0 && (

                                <div className="incident-list">

                                    {filteredIncidents.map(
                                        (incident) => (

                                            <div
                                                className="incident-item"
                                                key={
                                                    incident._id
                                                }
                                            >


                                                {/* ICON */}

                                                <div
                                                    className={
                                                        incident.severity ===
                                                            "CRITICAL" ||
                                                        incident.severity ===
                                                            "HIGH"
                                                            ? "incident-status critical"
                                                            : incident.severity ===
                                                                "MEDIUM"
                                                                ? "incident-status warning"
                                                                : "incident-status safe"
                                                    }
                                                >

                                                    <AlertTriangle
                                                        size={14}
                                                    />

                                                </div>


                                                {/* INFORMATION */}

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

                                                    <span>

                                                        Type:{" "}

                                                        {
                                                            incident.incidentType
                                                        }

                                                        {" · "}

                                                        Status:{" "}

                                                        {
                                                            incident.status
                                                        }

                                                    </span>

                                                </div>


                                                {/* SEVERITY */}

                                                <span
                                                    className={
                                                        `severity ${getSeverityClass(
                                                            incident.severity
                                                        )}`
                                                    }
                                                >

                                                    {
                                                        incident.severity
                                                    }

                                                </span>


                                                {/* STATUS */}

                                                <span
                                                    className="severity resolved"
                                                >

                                                    {
                                                        incident.status
                                                    }

                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                    </div>


                    {/* SUMMARY CARDS */}

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
                                Total
                            </p>

                            <h3>
                                {incidents.length}
                            </h3>

                            <span className="stat-description">
                                MongoDB incidents
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
                                            i.severity ===
                                            "CRITICAL"
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
                                            i.severity ===
                                            "HIGH"
                                    ).length
                                }

                            </h3>

                            <span className="stat-description">
                                High severity
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
                                            i.status ===
                                            "PENDING"
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


export default Incidents;