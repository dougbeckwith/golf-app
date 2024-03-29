const getDate = () => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

// shotType = 'carryDistance' | 'totalDistance'
const sortClubsByDistance = (clubs, shotType) => {
  const clubsWithAverageYards = [];

  clubs.forEach((club) => {
    if (club.shots.length === 0) {
      clubsWithAverageYards.push({ ...club, averageDistance: 0 });
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

// To dynamically style the club distance bar width
const getDistanceBarPercentage = (averageDistance, longestDistance) => {
  const percentage = (averageDistance / longestDistance).toFixed(2) + "%";
  if (percentage[0] === "1") {
    return "100%";
  } else return percentage.slice(2);
};

const getAveragePutsPerRound = (rounds) => {
  let totalPuts = 0;
  let avgPuts = null;
  const totalRounds = rounds.length;

  rounds.forEach((round) => {
    totalPuts += round.puts;
  });

  avgPuts = totalPuts / totalRounds;
  avgPuts = roundToOneDecimal(avgPuts, 1);
  return avgPuts;
};

const getAverageGreensPerRound = (rounds) => {
  let totalGreens = 0;
  let avgGreens = null;
  const totalRounds = rounds.length;

  rounds.forEach((round) => {
    totalGreens += round.greens;
  });

  avgGreens = totalGreens / totalRounds;
  avgGreens = roundToOneDecimal(avgGreens, 1);
  return avgGreens;
};

const getAverageFairwaysPerRound = (rounds) => {
  let totalFairways = 0;
  let avgFairways = null;
  const totalRounds = rounds.length;

  rounds.forEach((round) => {
    totalFairways += round.fairways;
  });

  avgFairways = totalFairways / totalRounds;
  avgFairways = roundToOneDecimal(avgFairways, 1);
  return avgFairways;
};

const roundToOneDecimal = (value, precision) => {
  let multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

const isNumeric = (value) => {
  return /^\d+$/.test(value);
};

const getEncodedCredentials = (authUser) => {
  return btoa(`${authUser.email}:${authUser.password}`);
};

export {
  getAverageDistance,
  getDistanceBarPercentage,
  getAverageGreensPerRound,
  getAverageFairwaysPerRound,
  sortClubsByDistance,
  findClubById,
  getAveragePutsPerRound,
  isNumeric,
  getEncodedCredentials,
  getDate
};
