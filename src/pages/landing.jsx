import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import AdminDashboard from "./adminDashboard";
import UserDashboard from "./userDashboard";

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
};

export default LandingPage;