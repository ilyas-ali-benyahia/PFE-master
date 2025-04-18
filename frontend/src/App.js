import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './landinpage';
import Register from './components/authentification/rgister';
import Login from './components/authentification/login';
import TransformLearningApp from "./dashbord/index";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userInfo");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protect Dashboard */}
        <Route
          path="/dashboards"
          element={
            <ProtectedRoute>
              <TransformLearningApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
