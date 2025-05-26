import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Add log out
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header>
      <div>
        <div className="logo"></div>
        <nav>
          <div>
            <Link to="/homepage">Homepage</Link>
          </div>
          <div>
            <Link to="/users">Chat</Link>
          </div>
          {!user ? (
            <div>
              <Link to="/signup">Sign Up</Link>
            </div>
          ) : (
            ""
          )}
          <div>
            <Link to="/login">{user ? "Log Out" : "Log In"}</Link>
          </div>
          {user ? (
            <div>
              <Link to="/profile">Profile</Link>
            </div>
          ) : (
            ""
          )}
        </nav>
      </div>
    </header>
  );
}
