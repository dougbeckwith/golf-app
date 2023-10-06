import React from "react";
import Button from "./Button";
import ShotIcon from "./ShotIcon";
import StatSmall from "./StatSmall";

const GreenItem = ({ round, handleDeleteGreen }) => {
  const { _id, greens } = round;

  const handleDelete = () => {
    handleDeleteGreen(_id);
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-dark-200 rounded-md py-2 px-4">
      <ShotIcon />
      <StatSmall label="Greens" value={`${greens}%`} />
      <Button color={"gray"} styles={"h-[40px] text-dark-300 "} onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
};

export default GreenItem;
