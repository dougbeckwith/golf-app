import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineGolfCourse } from "react-icons/md";
import UserContext from "../context/UserContext";
import { getAverageDistance } from "../helpers";

const ShotItem = ({
  setClub,
  setAvgTotalDistance,
  setAvgTotalCarry,
  shot,
  setShow,
  setMessage
}) => {
  const params = useParams();
  const id = params.id;

  const { authUser } = useContext(UserContext);

  const deleteShot = async () => {
    try {
      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);

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

      const response = await fetch(
        `${process.env.REACT_APP_CYCLIC_URL}/clubs/${id}`,
        options
      );

      if (response.status === 200) {
        setClub((prev) => {
          const club = {
            ...prev
          };
          club.shots = club.shots.filter((item) => {
            return item.shotId !== shot.shotId;
          });
          setAvgTotalCarry(getAverageDistance(club, "totalCarry"));
          setAvgTotalDistance(getAverageDistance(club, "totalDistance"));
          return club;
        });
      } else if (response.status === 400) {
        setMessage("Bad Reqeust");
        setShow(true);
      } else if (response.status === 401) {
        setMessage("Unauthorized");
        setShow(true);
      } else if (response.status === 403) {
        setMessage("Forbidden");
        setShow(true);
      } else if (response.status === 404) {
        setMessage("Club Not Found");
        setShow(true);
      } else if (response.status === 500) {
        setMessage("Server Error");
        setShow(true);
      }
    } catch (error) {
      console.log(error);
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
            <div className="text-blue-400 text-md font-bold">
              <span>{shot.totalDistance}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Carry</p>
            <div className="text-blue-400 text-md font-bold">
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
    </>
  );
};

export default ShotItem;
