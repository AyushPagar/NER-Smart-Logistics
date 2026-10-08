import {
    TrendingUp,
    Activity,
    ShieldCheck,
    Route
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Analytics() {

    return (
        <div className="app">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <section className="dashboard">

                    <div className="welcome-row">

                        <div>
                            <h2>Analytics</h2>

                            <p>
                                Regional logistics and road
                                accessibility intelligence.
                            </p>
                        </div>

                    </div>

                    <div className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-icon blue">
                                <Activity size={20} />
                            </div>

                            <p>Total Incidents</p>

                            <h3>248</h3>

                            <span className="stat-description">
                                Reports received
                            </span>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon green">
                                <ShieldCheck size={20} />
                            </div>

                            <p>Verification Rate</p>

                            <h3>84%</h3>

                            <span className="stat-description">
                                Reports verified
                            </span>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon purple">
                                <Route size={20} />
                            </div>

                            <p>Route Safety</p>

                            <h3>72%</h3>

                            <span className="stat-description">
                                Regional score
                            </span>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon red">
                                <TrendingUp size={20} />
                            </div>

                            <p>Risk Index</p>

                            <h3>31%</h3>

                            <span className="stat-description">
                                Current regional risk
                            </span>

                        </div>

                    </div>

                    <div className="dashboard-grid">

                        <div className="map-card">

                            <div className="card-header">

                                <div>
                                    <h3>
                                        Incident Trends
                                    </h3>

                                    <p>
                                        Monthly incident activity
                                    </p>
                                </div>

                            </div>

                            <div className="map-placeholder">

                                <div className="map-center">

                                    <TrendingUp size={30} />

                                    <span>
                                        Analytics Chart
                                    </span>

                                    <small>
                                        Chart integration coming next
                                    </small>

                                </div>

                            </div>

                        </div>

                        <div className="incident-card">

                            <div className="card-header">

                                <div>
                                    <h3>
                                        Risk Distribution
                                    </h3>

                                    <p>
                                        By incident category
                                    </p>
                                </div>

                            </div>

                            <div className="incident-list">

                                <div className="incident-item">
                                    <div className="incident-info">
                                        <strong>Flood</strong>
                                        <span>38% of incidents</span>
                                    </div>
                                </div>

                                <div className="incident-item">
                                    <div className="incident-info">
                                        <strong>Landslide</strong>
                                        <span>27% of incidents</span>
                                    </div>
                                </div>

                                <div className="incident-item">
                                    <div className="incident-info">
                                        <strong>Road Damage</strong>
                                        <span>21% of incidents</span>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Analytics;