import React from "react";
import { Link } from "react-router-dom";

const UnhandledError = () => {
  return (
    <div className="bg-dark-400 text-gray-100 h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-7xl mb-8">Oops!</h1>
        <p className="text-4xl mb-8">500 - Server Error!</p>
        <Link to="/clubs">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-100 bg-blue-100 hover:bg-blue-200 ">
            Clubs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UnhandledError;
