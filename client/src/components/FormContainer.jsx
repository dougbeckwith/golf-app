import React from "react";

const FormContainer = ({ children }) => {
  return (
    <div className="px-3 mt-5 md:mt-10 w-full flex flex-col justify-center items-center ">
      {children}
    </div>
  );
};

export default FormContainer;
