import React from "react";
import { MdOutlineGolfCourse } from "react-icons/md";
import Button from "./Button";
import StatsSection from "./StatsSection";

const PutItem = ({ round, handleDeletePut }) => {
  const { _id, puts, dateCreated } = round;

  const handleDeleteClick = () => {
    handleDeletePut(_id);
  };

  return (
    <div className="bg-dark-200 max-w-fit">
      <ul className="flex gap-4">
        <StatsSection value={puts} label={"Puts"} />
        <Button onClick={handleDeleteClick}>Delete</Button>
      </ul>
    </div>
  );
};

export default PutItem;
