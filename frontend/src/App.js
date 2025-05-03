import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabase"; // Adjust path if needed

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

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
    return <div>Loading...</div>; // You can replace this with a Chakra spinner if desired
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected dashboard route */}
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
