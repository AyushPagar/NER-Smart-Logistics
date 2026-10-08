import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import LiveMap from "./pages/LiveMap";
import RoutePlanner from "./pages/RoutePlanner";
import Incidents from "./pages/Incidents";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Verification from "./pages/Verification";
import Settings from "./pages/Settings";
import ReportIncident from "./pages/ReportIncident";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/map"
                    element={<LiveMap />}
                />

                <Route
                    path="/routes"
                    element={<RoutePlanner />}
                />

                <Route
                    path="/incidents"
                    element={<Incidents />}
                />

                <Route
                    path="/analytics"
                    element={<Analytics />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />

                <Route
                    path="/report"
                    element={<ReportIncident />}
                />

                <Route
                    path="/verification"
                    element={<Verification />}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;