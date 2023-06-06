// shotType = 'carryDistance' | 'totalDistance'
const sortClubsByDistance = (clubs, shotType) => {
  const clubsWithAverageYards = [];
  clubs.forEach((club) => {
    if (club.shots.length === 0) {
      clubsWithAverageYards.push({ ...club, averageTotalDistance: 0 });
    } else {
      const averageDistance = getAverageDistance(club, shotType);
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

const getAverageDistance = (club, shotType) => {
  let totalYards = 0;
  let totalShots = club.shots.length;
  if (totalShots === 0) {
    return 0;
  }

  club.shots.forEach((shot) => {
    totalYards = totalYards + +shot[shotType];
  });

  const averageDistance = Math.round(totalYards / totalShots);
  return averageDistance;
};

const findClubById = (id, clubData) => {
  const club = clubData.find((club) => {
    return club._id === id;
  });
  return club;
};

// To dynamically style the distance bar width
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
