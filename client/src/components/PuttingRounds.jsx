import React from "react";
import PutList from "../components/PutList";
import PutItem from "../components/PutItem";
import Header from "./HeadingOne";
import { v4 as uuidv4 } from "uuid";

const PuttingRounds = ({ putData, handleDeletePut }) => {
  return (
    <>
      <Header>Putting Rounds</Header>
      <PutList>
        {putData.map((round) => {
          return <PutItem key={uuidv4()} round={round} handleDeletePut={handleDeletePut} />;
        })}
      </PutList>
    </>
  );
};

export default PuttingRounds;
