import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotherRegistration from "./pages/mother/MotherRegistration";
import CaseDetails from "./pages/chw/CaseDetails";
import CHWDashboard from "./pages/chw/CHWDashboard";
import CHWLogin from "./pages/chw/CHWLogin";
import MotherLogin from "./pages/mother/MotherLogin";
import HealthCheckin from "./pages/mother/HealthCheckin";
import MotherDashboard from "./pages/mother/MotherDashboard";
import IntelligenceLogin from "./pages/intelligence/IntelligenceLogin";
import IntelligenceDashboard from "./pages/intelligence/intelligenceDashboard";
import MotherJourney from "./pages/mother/MotherJourney";
import MotherHelp from "./pages/mother/MotherHelp";
import RoleSelection from "./pages/RoleSelection";
import CHWRegistration from "./pages/chw/CHWRegistration";
import IntelligenceRegistration from "./pages/intelligence/IntelligenceRegistration";
import PublicSite, { PublicInfo } from "./pages/PublicSite";
import EmergencyHelp from "./pages/EmergencyHelp";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PublicSite />}
        />

        <Route path="/about" element={<PublicInfo type="about" />} />
        <Route path="/contact" element={<PublicInfo type="contact" />} />
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/emergency" element={<EmergencyHelp />} />

        <Route
          path="/mother/login"
          element={<MotherLogin />}
        />

        <Route
          path="/mother/register"
          element={<MotherRegistration />}
        />
        <Route
          path="/mother"
          element={<MotherDashboard />}
        ></Route>
        <Route
          path="/chw"
          element={<CHWDashboard />}
        />
        <Route
          path="/chw/cases/:id"
          element={<CaseDetails />}
        />
        <Route path="/chw/login" element={<CHWLogin />} />
        <Route path="/mother/login" element={<MotherLogin />} />
        <Route
          path="/mother/checkin"
          element={<HealthCheckin />}
        />

        <Route
          path="/intelligence/login"
          element={<IntelligenceLogin />}
        />

        <Route
          path="/intelligence"
          element={<IntelligenceDashboard />}
        />

        <Route
          path="/mother/journey"
          element={<MotherJourney />}
        />

        <Route
          path="/mother/help"
          element={<MotherHelp />}
        />

        <Route
          path="/chw/register"
          element={<CHWRegistration />}
        />

        <Route
          path="/intelligence/register"
          element={<IntelligenceRegistration />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;