import React from "react";
import { Link } from "react-router-dom";

const FormFooter = ({ to, children, text }) => {
  return (
    <div className="flex w-full justify-center items-center text-sm pt-4 flex-wrap">
      <p className="text-gray-300 pr-2">{text}</p>
      <Link to={to} className="text-blue-200 cursor-pointer py-3 rounded-md hover:text-blue-100">
        {children}
      </Link>
    </div>
  );
};

export default FormFooter;
