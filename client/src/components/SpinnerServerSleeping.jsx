import React from "react";
import Loader from "./Spinner";

const SpinnerServerSleeping = ({ isLoading, text, children }) => {
  return (
    <div className="pb-10 text-gray-200">
      <Loader isLoading={isLoading} text={text} />
      <p className="pt-5">{children}</p>
      <p>Server may be asleep.</p>
    </div>
  );
};

export default SpinnerServerSleeping;
