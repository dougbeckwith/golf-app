import React from "react";
import Button from "./Button";
import ShotIcon from "./ShotIcon";
import StatSmall from "./StatSmall";

const PutItem = ({ round, handleDeletePut }) => {
  const { _id, puts } = round;

  const handleDeleteClick = () => {
    handleDeletePut(_id);
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-dark-200 rounded-md py-2 px-4">
      <ShotIcon />
      <StatSmall label="Puts" value={puts} />
      <Button color={"gray"} styles={"h-[40px] text-dark-300 "} onClick={handleDeleteClick}>
        Delete
      </Button>
    </div>
  );
};

export default PutItem;
