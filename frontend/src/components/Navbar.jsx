import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/Icon PNG background-01.png";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("joblyhubUser") || "null");

  const [shrunk, setShrunk] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "employer"
      ? "/employer/dashboard"
      : user?.role === "job_seeker"
      ? "/job-seeker/dashboard"
      : "/login";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShrunk(true);
      } else {
        setShrunk(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("joblyhubToken");
    localStorage.removeItem("joblyhubUser");
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className={`navbar ${shrunk ? "navbar-shrunk" : ""}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="JoblyHub Logo" className="logo-img" />
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          type="button"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <nav className="nav-links">
            <NavLink to="/" end className={navClass} onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink to="/jobs" className={navClass} onClick={closeMenu}>
              Find Jobs
            </NavLink>

            <NavLink to="/help" className={navClass} onClick={closeMenu}>
              Help Center
            </NavLink>
          </nav>

          <div className="nav-actions">
            {user ? (
              <>
                <NavLink
                  to={dashboardPath}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "dashboard-btn active-action" : "dashboard-btn"
                  }
                >
                  Dashboard
                </NavLink>

                <button onClick={logout} className="logout-btn" type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "login-btn active-action" : "login-btn"
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "post-job-btn active-action" : "post-job-btn"
                  }
                >
                  Get Started
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}