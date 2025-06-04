import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen dark:dark_background p-0">
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
