import { Outlet } from "react-router-dom";
import { AuthProvider } from "./auth/index";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen dark:dark_background text-text_secondary dark:text-text_primary">
        <Toaster position="top-center" />
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
