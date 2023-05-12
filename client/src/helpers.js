// Take clubs array and add avgYards property to it
// Return Sort the array from highest to lowest value or avgYards value
const sortClubsByAvgYards = (clubsArray) => {
  // New array with avgYards property added to it
  const clubsWithAverageYards = [];

  // Loop through each club check no shots add 0 value to avgYards
  // Else get the avgYards for the club
  // Push that onto the clubsWithAverageYards array
  clubsArray.forEach((club) => {
    if (club.shots.length === 0) {
      clubsWithAverageYards.push({ ...club, avgYards: 0 });
    } else {
      const avgYards = getAverageYards(club);
      clubsWithAverageYards.push({ ...club, avgYards: avgYards });
    }
  });

  // Sorts array by highest avgYards to lowest
  const sortedArray = clubsWithAverageYards.sort(function (a, b) {
    return b.avgYards - a.avgYards;
  });
  return sortedArray;
};

const getAverageYards = (club) => {
  let totalYards = 0;
  let totalShots = club.totalShots;
  if (club.totalShots === 0) {
    return 0;
  } else {
    club.shots.forEach((shot) => {
      totalYards += shot.yards;
    });
    return Math.round(totalYards / totalShots);
  }
};

const getAvgYardsForDataBase = (club, shot) => {
  let totalYards = parseInt(shot);
  let totalShots = club.totalShots + 1;
  if (club.shots.length === 0) {
    return shot;
  } else {
    club.shots.forEach((shot) => {
      totalYards += shot.yards;
    });
    return Math.round(totalYards / totalShots);
  }
};

const findClubById = (id, clubData) => {
  const found = clubData.find((club) => {
    return club._id === id;
  });
  return found;
};

export {
  getAverageYards,
  getAvgYardsForDataBase,
  sortClubsByAvgYards,
  findClubById
};
