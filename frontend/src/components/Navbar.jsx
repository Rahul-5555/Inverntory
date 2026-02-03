import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer"
        >
          Inventory<span className="text-gray-800">App</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavItem to="/">Home</NavItem>
          {token && <NavItem to="/products">Products</NavItem>}
          {token && <NavItem to="/dashboard">Dashboard</NavItem>}

          {!token ? (
            <>
              <NavItem to="/login">Login</NavItem>
              <NavItem to="/signup">Signup</NavItem>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-3 bg-white shadow rounded-lg p-4 space-y-3">
          <MobileItem to="/" onClick={() => setOpen(false)}>
            Home
          </MobileItem>

          {token && (
            <>
              <MobileItem to="/products" onClick={() => setOpen(false)}>
                Products
              </MobileItem>
              <MobileItem to="/dashboard" onClick={() => setOpen(false)}>
                Dashboard
              </MobileItem>
            </>
          )}

          {!token ? (
            <>
              <MobileItem to="/login" onClick={() => setOpen(false)}>
                Login
              </MobileItem>
              <MobileItem to="/signup" onClick={() => setOpen(false)}>
                Signup
              </MobileItem>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

/* -------------------- */
/* Reusable Components  */
/* -------------------- */

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `font-medium transition ${isActive
        ? "text-blue-600"
        : "text-gray-700 hover:text-blue-600"
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className="block text-gray-700 font-medium hover:text-blue-600"
  >
    {children}
  </NavLink>
);

export default Navbar;
