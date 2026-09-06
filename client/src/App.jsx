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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<h1>MaMlinzi MVP</h1>}
        />

        <Route
          path="/mother/register"
          element={<MotherRegistration />}
        />
        <Route 
        path="/mother" 
        element={<MotherDashboard/>}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;