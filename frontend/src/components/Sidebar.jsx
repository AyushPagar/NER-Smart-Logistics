import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Map,
    Route,
    AlertTriangle,
    BarChart3,
    FileText,
    FilePlus,
    Settings,
    ShieldCheck,
    Truck
} from "lucide-react";


function Sidebar() {

    return (

        <aside className="sidebar">


            {/* BRAND */}

            <div className="brand">

                <div className="brand-icon">

                    <Truck size={22} />

                </div>

                <div>

                    <h2>
                        NER
                    </h2>

                    <span>
                        INTELLIGENCE
                    </span>

                </div>

            </div>


            {/* MAIN */}

            <div className="menu-section">

                <p className="menu-title">
                    MAIN
                </p>


                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <LayoutDashboard size={19} />

                    <span>
                        Dashboard
                    </span>

                </NavLink>


                <NavLink
                    to="/map"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <Map size={19} />

                    <span>
                        Live Map
                    </span>

                </NavLink>


                <NavLink
                    to="/routes"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <Route size={19} />

                    <span>
                        Route Planner
                    </span>

                </NavLink>


                <NavLink
                    to="/incidents"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <AlertTriangle size={19} />

                    <span>
                        Incidents
                    </span>

                    <span className="notification-count">
                        7
                    </span>

                </NavLink>


                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <BarChart3 size={19} />

                    <span>
                        Analytics
                    </span>

                </NavLink>

            </div>


            {/* MANAGEMENT */}

            <div className="menu-section">

                <p className="menu-title">
                    MANAGEMENT
                </p>


                <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <FileText size={19} />

                    <span>
                        Reports
                    </span>

                </NavLink>


                <NavLink
                    to="/report"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <FilePlus size={19} />

                    <span>
                        Report Incident
                    </span>

                </NavLink>


                <NavLink
                    to="/verification"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <ShieldCheck size={19} />

                    <span>
                        Verification
                    </span>

                </NavLink>

            </div>


            {/* BOTTOM */}

            <div className="sidebar-bottom">


                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive
                            ? "menu-item active"
                            : "menu-item"
                    }
                >

                    <Settings size={19} />

                    <span>
                        Settings
                    </span>

                </NavLink>


                <div className="system-status">

                    <span className="status-dot"></span>

                    <div>

                        <strong>
                            System Online
                        </strong>

                        <small>
                            All services operational
                        </small>

                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;