import React, { useState, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const [isFaTimes, setIsFaTimes] = useState(false);
  const { actions } = useContext(UserContext);

  const toggleIcon = () => {
    setIsFaTimes(!isFaTimes);
  };

  const handleSignOut = () => {
    actions.signOut();
  };

  return (
    <nav className="w-full h-[90px] bg-dark-500 text-sm">
      <div className="h-full mx-auto flex  items-center px-3 sm:px-0">
        <p className="sm:pl-4 text-3xl  font-semibold text-blue-400">
          Golf Stats
        </p>
        {/* Desktop Links */}
        <ul className="hidden md:flex">
          <li id="nav" className="font-medium py-10 ml-2">
            <NavLink
              className="text-gray-400  hover:bg-dark-200 hover:text-white ml-8 px-3 py-1 rounded-md"
              to="/clubs"
              end>
              Clubs
            </NavLink>
          </li>
          <li id="nav" className="font-medium py-10 ml-2">
            <NavLink
              className="text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-1 rounded-md"
              to="/handicap">
              Handicap
            </NavLink>
          </li>
        </ul>
        <button className=" px-3 font-medium py-10 ml-auto hidden md:block">
          <NavLink
            onClick={handleSignOut}
            className="text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md"
            to="/logout">
            Logout
          </NavLink>
        </button>
        <div className="block md:hidden cursor-pointer z-10 pl-2 ml-auto pr-3">
          {isFaTimes ? (
            <FaTimes onClick={toggleIcon} size={30} color={"#9ca3af"} />
          ) : (
            <FaBars onClick={toggleIcon} size={30} color={"#9ca3af"} />
          )}
        </div>
      </div>

      {/* Mobile Links */}
      {isFaTimes && (
        <ul
          id="nav"
          onClick={toggleIcon}
          className=" text-2xl absolute md:hidden top-[90px] left-0 w-full h-screen bg-dark-500 flex flex-col items-center z-10">
          <li className=" px-3 font-medium py-10"></li>
          <li className=" px-3 font-medium py-10">
            <NavLink
              className="text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md"
              to="/clubs">
              Clubs
            </NavLink>
          </li>
          <li id="nav" className="font-medium py-10 ml-2">
            <NavLink
              className="text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md"
              to="/handicap">
              Handicap
            </NavLink>
          </li>
          <li className=" px-3 font-medium py-10">
            <NavLink
              onClick={handleSignOut}
              className="text-gray-400  hover:bg-dark-200 hover:text-white px-3 py-2 rounded-md"
              to="/">
              Logout
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
