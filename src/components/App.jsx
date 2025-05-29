import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    // <AuthProvider>
    <div className="h-full bg-gray-500 p-0">
      <Outlet />
    </div>
    // </AuthProvider>
  );
}

export default App;
