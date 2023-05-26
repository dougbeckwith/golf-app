// Sory clubs by distance (type = 'carryDistance' | 'totalDistance')
const sortClubsByDistance = (clubs, type) => {
  const clubsWithAverageYards = [];

  clubs.forEach((club) => {
    if (club.shots.length === 0) {
      clubsWithAverageYards.push({ ...club, averageTotalDistance: 0 });
    } else {
      const averageDistance = getAverageDistance(club, type);
      clubsWithAverageYards.push({
        ...club,
        averageDistance: averageDistance
      });
    }
  });

  const sortedClubs = clubsWithAverageYards.sort(function (a, b) {
    return b.averageDistance - a.averageDistance;
  });

  return sortedClubs;
};

//Get the average distance of the club (type = 'carryDistance' | 'totalDistance')
const getAverageDistance = (club, type) => {
  let totalYards = 0;
  let totalShots = club.shots.length;

  if (totalShots === 0) {
    return 0;
  }

  club.shots.forEach((shot) => {
    totalYards = totalYards + +shot[type];
  });

  const avgerageDistance = Math.round(totalYards / totalShots);

  return avgerageDistance;
};

const findClubById = (id, clubData) => {
  const club = clubData.find((club) => {
    return club._id === id;
  });
  return club;
};

// To dynamicly style the distance bar width
const getDistanceBarPercentage = (averageDistance, longestDistance) => {
  const percentage = (averageDistance / longestDistance).toFixed(2) + "%";
  if (percentage[0] === "1") {
    return "100%";
  } else return percentage.slice(2);
};

export {
  getAverageDistance,
  getDistanceBarPercentage,
  sortClubsByDistance,
  findClubById
};
