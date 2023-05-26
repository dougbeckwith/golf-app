import React from "react";
import { getAverageTotalDistance, getDistanceBarPercentage } from "../helpers";

const ClubItem = ({ club, handleClick, longestTotalDistance }) => {
  const id = club._id;
  let averageTotalDistance = getAverageTotalDistance(club);

  const widthPercentage = getDistanceBarPercentage(
    averageTotalDistance,
    longestTotalDistance
  );

  return (
    <>
      <div
        onClick={() => handleClick(id)}
        className="text-gray-500 flex flex-col w-full rounded-md  mb-2 bg-dark-400 items-center justify-between hover:bg-dark-200 hover:cursor-pointer">
        <div className="flex w-full pb-2">
          <p className="">{club.clubName}</p>
          <span className="px-2 hidden sm:block">-</span>
          <p className="hidden sm:block">{club.brand}</p>
          {averageTotalDistance === 0 ? (
            <p className="ml-auto pr-4">0 yrds</p>
          ) : (
            <p className="ml-auto pr-4">{averageTotalDistance} yrds</p>
          )}
        </div>
        <div
          style={{ width: widthPercentage }}
          className={`mr-auto bg-gradient-to-r from-dark-200 to-blue-400 rounded-full h-4 mb-1 dark:bg-gray-700`}></div>
      </div>
    </>
  );
};

export default ClubItem;
