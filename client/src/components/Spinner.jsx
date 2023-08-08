import React from "react";
import BarLoader from "react-spinners/BarLoader";

const Spinner = ({ isLoading, text }) => {
  return (
    <>
      <h1 className="inline-block text-gray-300 text-md md:text-lg lg:text-lg font-semibold">
        {text}
      </h1>
      <BarLoader
        className="mt-1"
        color={"#007acc"}
        loading={isLoading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  );
};

export default Spinner;
