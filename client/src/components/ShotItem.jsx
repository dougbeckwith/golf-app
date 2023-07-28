import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import { getAverageDistance } from "../helpers";
import ShotIcon from "./ShotIcon";
import Button from "./Button"; // Make sure to import the Button component
import StatSmall from "./StatSmall";

const ShotItem = ({ setClub, setAvgTotalDistance, setAvgCarryDistance, shot }) => {
  const params = useParams();
  const id = params.id;
  const { authUser } = useContext(UserContext);

  const deleteShot = async () => {
    try {
      const encodedCredentials = btoa(`${authUser.email}:${authUser.password}`);
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedCredentials}`
        }
      };
      const response = await fetch(
        `${process.env.REACT_APP_URL}/clubs/${id}/shots/${shot._id}`,
        options
      );

      if (response.status === 204) {
        setClub((prev) => {
          const club = {
            ...prev
          };
          club.shots = club.shots.filter((item) => {
            return item._id !== shot._id;
          });
          setAvgCarryDistance(getAverageDistance(club, "totalCarry"));
          setAvgTotalDistance(getAverageDistance(club, "totalDistance"));
          return club;
        });
      } else if (response.status === 400) {
        alert("Bad Request");
      } else if (response.status === 401) {
        alert("Bad Request");
      } else if (response.status === 403) {
        alert("Bad Request");
      } else if (response.status === 404) {
        alert("Bad Request");
      } else if (response.status === 500) {
        alert("Bad Request");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between gap-4 bg-dark-400 rounded-md py-2 px-4">
      <ShotIcon />
      <StatSmall label="Total" value={shot.totalDistance} />
      <StatSmall label="Carry" value={shot.totalCarry} />
      <Button onClick={deleteShot}>Delete</Button>
    </div>
  );
};

export default ShotItem;
