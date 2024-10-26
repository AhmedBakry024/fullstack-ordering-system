import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        <a
          href="/"
          className={`mx-1.5 sm:mx-6 ${
            currentPath === "/"
              ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500"
              : "border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500"
          }`}
        >
          Home
        </a>
        <a
          href="/login"
          className={`mx-1.5 sm:mx-6 ${
            currentPath === "/login"
              ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500"
              : "border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500"
          }`}
        >
          Login
        </a>
        <a
          href="/register"
          className={`mx-1.5 sm:mx-6 ${
            currentPath === "/register"
              ? "text-gray-800 dark:text-gray-200 border-b-2 border-blue-500"
              : "border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500"
          }`}
        >
          Register
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
