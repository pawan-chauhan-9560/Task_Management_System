import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Task", path: "/task" }
  ];

  return (
    <header className="bg-white shadow-md w-full">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-3xl font-extrabold cursor-pointer transition hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Task Management System
        </h1>
        <div className="md:hidden">
          {menuOpen ? (
            <X className="w-8 h-8 text-gray-800" onClick={toggleMenu} />
          ) : (
            <Menu className="w-8 h-8 text-gray-800" onClick={toggleMenu} />
          )}
        </div>
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0`}
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMenuOpen(false);
              }}
              className="text-gray-700 hover:text-pink-500 text-lg px-4 py-2 rounded transition"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
