import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./common/Navbar";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen dark:dark_background text-text_secondary dark:text-text_primary">
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
