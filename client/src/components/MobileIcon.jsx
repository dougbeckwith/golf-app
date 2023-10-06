import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const MobileIcon = ({ toggleIcon, isFaTimes }) => {
  return (
    <div className="md:hidden cursor-pointer z-10 ml-auto">
      {isFaTimes ? (
        <FaTimes onClick={toggleIcon} size={30} color={"#9ca3af"} />
      ) : (
        <FaBars onClick={toggleIcon} size={30} color={"#9ca3af"} />
      )}
    </div>
  );
};

export default MobileIcon;
