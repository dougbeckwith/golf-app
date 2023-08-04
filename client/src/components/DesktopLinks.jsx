import React from "react";
import { NavLink } from "react-router-dom";

const DesktopLinks = ({ handleSignOut }) => {
  return (
    <ul id="nav" className="hidden text-sm md:flex gap-4 text-gray-200 w-full ml-10">
      <li>
        <NavLink to="/clubs" end>
          Clubs
        </NavLink>
      </li>
      <li>
        <NavLink to="/puts">Puts</NavLink>
      </li>
      <li>
        <NavLink to="/greens">Greens</NavLink>
      </li>
      <li onClick={handleSignOut} className="ml-auto">
        <NavLink to="/">Logout</NavLink>
      </li>
    </ul>
  );
};

export default DesktopLinks;
