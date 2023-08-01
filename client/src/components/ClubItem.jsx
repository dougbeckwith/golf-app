import React from "react";
import { getAverageDistance, getDistanceBarPercentage } from "../helpers";

const ClubItem = ({ club, handleClick, longestShot, filterShotsBy }) => {
  const id = club._id;
  let averageDistance = getAverageDistance(club, filterShotsBy);

  const widthPercentage = getDistanceBarPercentage(averageDistance, longestShot);

  return (
    <>
      <div
        onClick={() => handleClick(id)}
        className="text-gray-200 flex flex-col w-full rounded-md  mb-2 bg-dark-400 items-center justify-between hover:bg-dark-100 hover:cursor-pointer px-2">
        <div className="flex w-full pb-2">
          <p className="">{club.name}</p>
          <span className="px-2 hidden sm:block">-</span>
          <p className="hidden sm:block">{club.brand}</p>
          {averageDistance === 0 ? (
            <p className="ml-auto pr-4">0 yrds</p>
          ) : (
            <p className="ml-auto pr-4">{averageDistance} yards</p>
          )}
        </div>
        <div
          style={{ width: widthPercentage }}
          className={`mr-auto bg-gradient-to-r from-dark-100 to-blue-300 rounded-full h-4 mb-1`}></div>
      </div>
    </>
  );
};

export default ClubItem;
