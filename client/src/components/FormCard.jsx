import React from "react";

const FormCard = ({ children }) => {
  return (
    <div className="rounded-md max-w-[400px] sm:mt-5 sm:border-2 sm:border-dark-100  sm:max-w-none w-full sm:w-[450px] sm:px-7 sm:py-3">
      {children}
    </div>
  );
};

export default FormCard;
