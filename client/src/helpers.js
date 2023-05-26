// Take clubs array and add averageTotalDistance property to it
// Sort array from highest to lowest value or averageTotalDistance value
const sortClubsByDistance = (clubs) => {
  const clubsWithAverageYards = [];

  clubs.forEach((club) => {
    if (club.shots.length === 0) {
      clubsWithAverageYards.push({ ...club, averageTotalDistance: 0 });
    } else {
      const averageTotalDistance = getAverageTotalDistance(club);
      clubsWithAverageYards.push({
        ...club,
        averageTotalDistance: averageTotalDistance
      });
    }
  });

  const sortedClubs = clubsWithAverageYards.sort(function (a, b) {
    return b.averageTotalDistance - a.averageTotalDistance;
  });

  return sortedClubs;
};

//Get the average total distance of the club
const getAverageTotalDistance = (club) => {
  let totalYards = 0;
  let totalShots = club.shots.length;

  if (totalShots === 0) {
    return 0;
  }

  club.shots.forEach((shot) => {
    totalYards += shot.totalDistance;
  });

  const avgerageTotalDistance = Math.round(totalYards / totalShots);

  return avgerageTotalDistance;
};

// const getAvgYardsForDataBase = (club, shot) => {
//   let totalYards = parseInt(shot);
//   let totalShots = club.totalShots + 1;
//   if (club.shots.length === 0) {
//     return shot;
//   } else {
//     club.shots.forEach((shot) => {
//       totalYards += shot.yards;
//     });
//     return Math.round(totalYards / totalShots);
//   }
// };

const findClubById = (id, clubData) => {
  const found = clubData.find((club) => {
    return club._id === id;
  });
  return found;
};

// To dynamicly style the distance bar width
const getDistanceBarPercentage = (
  averageTotalDistance,
  longestTotalDistance
) => {
  const percentage =
    (averageTotalDistance / longestTotalDistance).toFixed(2) + "%";
  if (percentage[0] === "1") {
    return "100%";
  } else return percentage.slice(2);
};

export {
  getAverageTotalDistance,
  // getAvgYardsForDataBase,
  getDistanceBarPercentage,
  sortClubsByDistance,
  findClubById
};
