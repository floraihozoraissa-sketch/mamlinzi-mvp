import { BrowserRouter, Routes, Route } from "react-router-dom";
import MotherRegistration from "./pages/mother/MotherRegistration";
import CHWDashboard from "./pages/chw/CHWDashboard";

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
  path="/chw"
  element={<CHWDashboard />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;