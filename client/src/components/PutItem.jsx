// import React, { useContext } from "react";
import React from "react";
// import { useParams } from "react-router-dom";
import { MdOutlineGolfCourse } from "react-icons/md";
// import UserContext from "../context/UserContext";

const PutItem = ({ round, handleDeleteRoundOfPuts }) => {
  // const { authUser } = useContext(UserContext);

  const handleDeletePut = async () => {
    try {
      console.log(round.roundId);
      console.log("delete put");
      // To Do
      // delete put
    } catch (error) {
      console.log(error);
    }
  };

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
            onClick={handleDeletePut}
            className="h-[40px] px-2 py-1 text-sm font-medium rounded-md shadow-sm text-dark-500 bg-gray-500 hover:bg-red ">
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default PutItem;
