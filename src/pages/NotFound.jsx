import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-400 mt-2">Oops! The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="mt-4 text-blue-400 hover:underline">
        Go Back Home
      </Link>
    </div>
  );
}
