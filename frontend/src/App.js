import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabase"; // Make sure to import supabase
import LandingPage from './landinpage';
import Register from './components/authentification/rgister'; // Use your existing register component
import Login from './components/authentification/login'; // Use your existing login component
import TransformLearningApp from "./dashbord/index";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("userInfo");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check the authentication status when the app loads
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        // If session exists but localStorage doesn't have userInfo, update it
        if (data.session && !localStorage.getItem("userInfo")) {
          localStorage.setItem("userInfo", JSON.stringify({
            token: data.session.access_token,
            user: data.session.user
          }));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem("userInfo", JSON.stringify({
            token: session.access_token,
            user: session.user
          }));
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem("userInfo");
        }
      }
    );

    checkAuth();

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while checking auth
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Protect Dashboard */}
        <Route
          path="/dashboards/*"
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
