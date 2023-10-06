import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DesktopLinks from "./DesktopLinks";
import MobileLinks from "./MobileLinks";
import UserContext from "../context/UserContext";
import MobileIcon from "./MobileIcon";

const Navbar = () => {
  const navigate = useNavigate();

  const [isFaTimes, setIsFaTimes] = useState(false);
  const { actions } = useContext(UserContext);

  const handleSignOut = () => {
    actions.signOut();
    navigate("/");
  };

  const toggleIcon = () => {
    setIsFaTimes(!isFaTimes);
  };

  return (
    <div className="w-full h-[60px] border-b-2 border-dark-100">
      <nav className="flex items-center h-full mx-3">
        <p className="text-xl font-semibold text-blue-400 shrink-0">Golf Stats</p>
        <DesktopLinks handleSignOut={handleSignOut} />

        {/* Toggles Hambuger Icon or Close Icon on small screens */}
        <MobileIcon toggleIcon={toggleIcon} isFaTimes={isFaTimes} />

        {/* Controls display of mobile menu */}
        {isFaTimes && <MobileLinks toggleIcon={toggleIcon} handleSignOut={handleSignOut} />}
      </nav>
    </div>
  );
};

export default Navbar;
