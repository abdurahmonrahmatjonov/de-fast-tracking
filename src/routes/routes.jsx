import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Auth from "../pages/auth";
import TrackingList from "../pages/tracking-list";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.main.isAuthenticated);
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/auth" replace />
  );
};

const RoutesComponent = () => {
  const isAuthenticated = useSelector((state) => state.main.isAuthenticated);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/tracking-list" : "/auth"} replace />
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/tracking-list"
        element={<ProtectedRoute element={TrackingList} />}
      />

    </Routes>
  );
};

export default RoutesComponent;
