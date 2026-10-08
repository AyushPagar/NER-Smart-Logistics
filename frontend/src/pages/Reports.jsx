import {
    FileText,
    Download,
    Calendar
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Reports() {

    return (
        <div className="app">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <section className="dashboard">

                    <div className="welcome-row">

                        <div>
                            <h2>Reports</h2>

                            <p>
                                Generate and review regional
                                logistics intelligence reports.
                            </p>
                        </div>

                        <button className="primary-button">
                            Generate Report
                        </button>

                    </div>

                    <div className="stats-grid">

                        <div className="stat-card">
                            <div className="stat-icon blue">
                                <FileText size={20} />
                            </div>

                            <p>Monthly Reports</p>
                            <h3>12</h3>

                            <span className="stat-description">
                                Generated this year
                            </span>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon green">
                                <Download size={20} />
                            </div>

                            <p>Downloads</p>
                            <h3>184</h3>

                            <span className="stat-description">
                                Report downloads
                            </span>
                        </div>

                    </div>

                    <div className="map-card">

                        <div className="card-header">

                            <div>
                                <h3>Available Reports</h3>

                                <p>
                                    Regional intelligence reports
                                </p>
                            </div>

                        </div>

                        <div className="incident-list">

                            <div className="incident-item">

                                <div className="incident-status safe">
                                    <FileText size={14} />
                                </div>

                                <div className="incident-info">

                                    <strong>
                                        NER Monthly Logistics Report
                                    </strong>

                                    <span>
                                        September 2026
                                    </span>

                                </div>

                                <button className="outline-button">
                                    <Download size={13} />
                                    Download
                                </button>

                            </div>

                            <div className="incident-item">

                                <div className="incident-status safe">
                                    <Calendar size={14} />
                                </div>

                                <div className="incident-info">

                                    <strong>
                                        Regional Incident Summary
                                    </strong>

                                    <span>
                                        Q3 2026
                                    </span>

                                </div>

                                <button className="outline-button">
                                    View
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Reports;