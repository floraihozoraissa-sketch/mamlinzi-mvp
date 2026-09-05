import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotherRegistration from "./pages/mother/MotherRegistration";
import CaseDetails from "./pages/chw/CaseDetails";
import CHWDashboard from "./pages/chw/CHWDashboard";
import CHWLogin from "./pages/chw/CHWLogin";
import MotherLogin from "./pages/mother/MotherLogin";
import HealthCheckin from "./pages/mother/HealthCheckin";
import MotherDashboard from "./pages/mother/MotherDashboard";


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
  path="/chw/case"
  element={<CaseDetails />}
/>
<Route path="/chw/login" element={<CHWLogin />} />
<Route path="/mother/login" element={<MotherLogin />} />
<Route
  path="/mother/checkin"
  element={<HealthCheckin />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;