import React from "react";
import { MdOutlineGolfCourse } from "react-icons/md";

const PutItem = ({ round, handleDeletePut }) => {
  return (
    <>
      <div className="py-2 rounded-md px-2 bg-dark-300">
        <div className="flex items-center gap-5">
          <div className="w-[50px] h-[50px]  flex justify-center items-center rounded-md">
            <MdOutlineGolfCourse size={40} color="#007acc" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Puts</p>
            <div className="text-blue-400 text-md font-bold">
              <span>{round.puts}</span>
            </div>
          </div>
          <button
            onClick={() => handleDeletePut(round._id)}
            className="ml-auto h-[40px] px-2 py-1 text-sm font-medium rounded-md shadow-sm text-dark-500 bg-gray-500 hover:bg-red ">
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default PutItem;
