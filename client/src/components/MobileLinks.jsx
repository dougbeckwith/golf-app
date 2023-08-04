import React from "react";
import { NavLink } from "react-router-dom";

const MobileLinks = ({ toggleIcon, handleSignOut }) => {
  return (
    <ul
      id="nav"
      className="text-gray-200 pt-5 text-xl gap-10 absolute md:hidden top-[70px] left-0 w-full h-screen bg-dark-300 flex flex-col items-center z-10">
      <li onClick={toggleIcon}>
        <NavLink to="/clubs" end>
          Clubs
        </NavLink>
      </li>
      <li onClick={toggleIcon}>
        <NavLink to="/puts">Puts</NavLink>
      </li>
      <li onClick={toggleIcon}>
        <NavLink to="/greens">Greens</NavLink>
      </li>
      <li onClick={handleSignOut}>
        <NavLink to="/">Logout</NavLink>
      </li>
    </ul>
  );
};

export default MobileLinks;
