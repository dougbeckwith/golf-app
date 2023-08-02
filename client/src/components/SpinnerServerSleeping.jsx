import React from "react";
import Spinner from "./Spinner";

const SpinnerServerSleeping = ({ isLoading, text, children }) => {
  return (
    <div className="pb-10 text-gray-200">
      <Spinner isLoading={isLoading} text={text} />
      <p className="pt-5">{children}</p>
      <p>Server may be asleep.</p>
    </div>
  );
};

export default SpinnerServerSleeping;
