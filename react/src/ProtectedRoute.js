import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { checkTokenValidity } from "./api/auth";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await checkTokenValidity();
        setIsAuthenticated(isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Handle error (e.g., set isAuthenticated to false)
        setIsAuthenticated(false);
      } finally {
        // Set loading to false once the authentication check is complete
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []); // Empty dependency array ensures the effect runs only once

  // If loading, you may choose to show a loading spinner or some other indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // If authenticated, render the provided element (e.g., Dashboard)
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
