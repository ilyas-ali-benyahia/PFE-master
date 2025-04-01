import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './landinpage';
import Register from './components/authentification/rgister';
import Login from './components/authentification/login';
import DashboardV2 from './dashbord';
import ChatBot from './dashbord/chatbot';
import DiagramGenerator from "./dashbord/diagrame";
import MermaidDiagramGenerator from "./dashbord/diagrame";
import TransformLearningApp from "./dashbord/uplode";
import Diagram from "./dashbord/diagrame";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userInfo"); // Check if user is logged in
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protect Dashboard Routes */}
        <Route path="/dashboards" element={<TransformLearningApp />} />

        <Route path="/chatbot" element={<MermaidDiagramGenerator />} />
        <Route path="/chatbott" element={< TransformLearningApp/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
