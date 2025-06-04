import React, { useContext } from "react";
import { AuthContext } from "../AuthContext.jsx";
import Navbar from "../Navbar.jsx";
import LogIn from "../forms/LogIn.jsx";

export default function MyProfile() {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark_background text-text_primary dark:text-text_secondary transition-colors duration-300">
      <Navbar></Navbar>
      <h1 className="text-text_secondary dark:text-text_primary">Same shit different page</h1>
    </div>
  );
}
