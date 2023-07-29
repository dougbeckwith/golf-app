import React from "react";
import Loader from "./Loader";

const ServerSleep = ({ isLoading, text, children }) => {
  return (
    <div className="pb-10 text-gray-500">
      <Loader isLoading={isLoading} text={text} />
      <p className="pt-5">{children}</p>
      <p>Server may be asleep.</p>
    </div>
  );
};

export default ServerSleep;
