import React from "react";
import { Link } from "react-router-dom";

const Logout = () => {
  return (
    <div className="bg-dark-400 h-screen flex justify-center items-center">
      <div className="pt-20 pb-16 text-center text-gray-100 lg:pt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="mx-auto max-w-4xl font-display text-3xl font-medium tracking-tight text-slate-900 sm:text-5xl md:7xl">
          Have a good day
        </h1>
        <p className="pt-0 mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-200">
          You've successfully signed out. See you soon!
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link to="/signin">
            <button className="px-4 py-2 md:px-7 text-sm font-medium rounded-md shadow-sm text-gray-100 bg-blue-100 hover:bg-blue-200 ">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Logout;
