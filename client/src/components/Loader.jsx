import React from "react";
import BarLoader from "react-spinners/BarLoader";
import H2 from "./HeadingTwo";

const Loader = ({ isLoading, text }) => {
  return (
    <>
      <H2>{text}</H2>
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

export default Loader;
