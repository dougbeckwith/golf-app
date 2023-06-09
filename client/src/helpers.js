import { v4 as uuidv4 } from "uuid";

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

const getAveragePutsPerRound = (rounds) => {
  let totalPuts = 0;
  const totalRounds = rounds.length;

  rounds.forEach((round) => {
    totalPuts += round.puts;
  });

  return totalPuts / totalRounds;
};

// temp data for putting chart
// will remove later
const getDummyDataPuts = () => {
  const start = new Date("01/01/2023");
  const end = new Date("01/10/2023");

  let loop = new Date(start);

  const dates = [];

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  while (loop <= end) {
    let date = loop.toLocaleString().slice(0, 9);
    if (date[8] === ",") {
      date = date.slice(0, 8);
    }
    dates.push(date);
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }

  const createPutRounds = () => {
    const rounds = [];
    for (let i = 0; i < 10; i++) {
      const rndInt = randomIntFromInterval(27, 45);
      rounds.push({
        puts: rndInt,
        date: dates[i],
        roundId: uuidv4()
      });
    }
    return rounds;
  };
  return createPutRounds();
};
export {
  getAverageDistance,
  getDistanceBarPercentage,
  sortClubsByDistance,
  findClubById,
  getDummyDataPuts,
  getAveragePutsPerRound
};
