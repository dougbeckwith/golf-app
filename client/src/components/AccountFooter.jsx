import React from "react";
import { Link } from "react-router-dom";

const AccountFooter = ({ to, children, text }) => {
  return (
    <div className="flex w-full justify-center items-center text-sm pt-4 flex-wrap">
      <p className="text-gray-200 pr-2">{text}</p>
      <Link to={to} className="text-blue-100 cursor-pointer py-3 rounded-md hover:text-blue-200">
        {children}
      </Link>
    </div>
  );
};

export default AccountFooter;
