import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { apiUrl } from "../../utils/api.js";

export default function LogIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/register/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      login(data);
      navigate("/homepage");
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  return (
    <>
      {!user ? (
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            id="username"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="Username"
          />
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
          />
          <button type="submit">Log In</button>
        </form>
      ) : (
        <button type="button" onClick={logOut}>
          Log Out
        </button>
      )}
    </>
  );
}
