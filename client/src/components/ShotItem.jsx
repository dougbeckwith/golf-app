import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineGolfCourse } from "react-icons/md";
import UserContext from "../context/UserContext";

const ShotItem = ({ setClub, club, shot }) => {
  const params = useParams();
  const id = params.id;

  const { authUser } = useContext(UserContext);

  // UPDATE club remove (shot)
  const deleteShot = async () => {
    console.log("delte shot");
    try {
      // const response = await axios.patch(
      //   `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`,
      //   {
      //     deleteShot: true,
      //     shotId: shot.shotId,
      //     club: club
      //   }
      // );

      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

      // fetch options
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`
        },
        body: JSON.stringify({
          deleteShot: true,
          shotId: shot.shotId
        })
      };
      // send request to update club (delete shot)
      const response = await fetch(
        `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`,
        options
      );
      console.log(response);
      // Update club state and update avgYards state
      if (response.status === 200) {
        //remove shot here
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="py-2 rounded-md px-2 bg-dark-300">
        <div className="flex  items-center gap-5">
          <div>
            <div className="w-[50px] h-[50px]  flex justify-center items-center rounded-md">
              <MdOutlineGolfCourse size={40} color="#007acc" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total</p>
            <div className="text-blue-400 text-xl font-bold">
              <span>{shot.totalDistance}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Carry</p>
            <div className="text-blue-400 text-xl font-bold">
              <span>{shot.totalCarry}</span>
            </div>
          </div>
          <button
            onClick={deleteShot}
            className="h-[40px] px-2 py-1 text-sm font-medium rounded-md shadow-sm text-dark-500 bg-gray-500 hover:bg-red ">
            Delete
          </button>
        </div>
      </div>

      {/*  */}
    </>
  );
};

export default ShotItem;
