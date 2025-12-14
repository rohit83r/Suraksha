
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
// Pages
import LandingPage from "./pages/LandingPage";
import LoginFormPage from "./pages/auth/LoginFormPage";
import RegisterFormPage from "./pages/auth/RegisterFormPage";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfilePage from "./pages/user/UserProfilePage";
import LiveTrackingPage from "./pages/user/LiveTrackingPage";
import AuthorityDashboard from "./pages/authority/AuthorityDashboard";
import TouristVerifyPage from "./pages/authority/TouristVerifyPage"
import GeoFenceAdminPage from "./pages/admin/GeoFenceAdminPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginFormPage />} />
          <Route path="/register" element={<RegisterFormPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/map" element={<LiveTrackingPage />} />
          <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
          <Route path="/authority/verifyTourist" element={<TouristVerifyPage />} />
          <Route path="/admin/geofence" element={<GeoFenceAdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
