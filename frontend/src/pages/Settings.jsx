import {
    Settings as SettingsIcon,
    Bell,
    Shield,
    User
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Settings() {

    return (
        <div className="app">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <section className="dashboard">

                    <div className="welcome-row">

                        <div>
                            <h2>Settings</h2>

                            <p>
                                Configure your NER Intelligence
                                platform preferences.
                            </p>
                        </div>

                    </div>

                    <div className="dashboard-grid">

                        <div className="map-card">

                            <div className="card-header">

                                <div>
                                    <h3>
                                        Account Settings
                                    </h3>

                                    <p>
                                        Administrator profile
                                    </p>
                                </div>

                            </div>

                            <div className="incident-list">

                                <div className="incident-item">

                                    <div className="incident-status safe">
                                        <User size={14} />
                                    </div>

                                    <div className="incident-info">
                                        <strong>
                                            Administrator Account
                                        </strong>

                                        <span>
                                            Manage your profile
                                        </span>
                                    </div>

                                </div>

                                <div className="incident-item">

                                    <div className="incident-status warning">
                                        <Bell size={14} />
                                    </div>

                                    <div className="incident-info">
                                        <strong>
                                            Notifications
                                        </strong>

                                        <span>
                                            Configure system alerts
                                        </span>
                                    </div>

                                </div>

                                <div className="incident-item">

                                    <div className="incident-status critical">
                                        <Shield size={14} />
                                    </div>

                                    <div className="incident-info">
                                        <strong>
                                            Security
                                        </strong>

                                        <span>
                                            Authentication and access
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="incident-card">

                            <div className="card-header">

                                <div>
                                    <h3>
                                        System
                                    </h3>

                                    <p>
                                        Platform configuration
                                    </p>
                                </div>

                            </div>

                            <div className="incident-list">

                                <div className="incident-item">

                                    <div className="incident-status safe">
                                        <SettingsIcon size={14} />
                                    </div>

                                    <div className="incident-info">
                                        <strong>
                                            System Status
                                        </strong>

                                        <span>
                                            All services operational
                                        </span>
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

export default Settings;