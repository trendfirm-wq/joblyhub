import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Icon PNG background-01.png";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("joblyhubUser") || "null");

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "employer"
      ? "/employer/dashboard"
      : user?.role === "job_seeker"
      ? "/job-seeker/dashboard"
      : "/login";

  const logout = () => {
    localStorage.removeItem("joblyhubToken");
    localStorage.removeItem("joblyhubUser");
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <img src={logo} alt="JoblyHub Logo" className="logo-img" />
          <span>JoblyHub</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>

          <NavLink to="/jobs" className={navClass}>
            Jobs
          </NavLink>

          <NavLink to="/about" className={navClass}>
            About
          </NavLink>

          <NavLink to="/help" className={navClass}>
            Help Center
          </NavLink>

          <NavLink to="/safety" className={navClass}>
            Safety
          </NavLink>

          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <NavLink to={dashboardPath} className={({ isActive }) =>
                isActive ? "dashboard-btn active-action" : "dashboard-btn"
              }>
                Dashboard
              </NavLink>

              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) =>
                isActive ? "login-btn active-action" : "login-btn"
              }>
                Login
              </NavLink>

              <NavLink to="/register" className={({ isActive }) =>
                isActive ? "post-job-btn active-action" : "post-job-btn"
              }>
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}