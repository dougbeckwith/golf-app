const { connectDB } = require("../helpers/database");
const Club = require("../models/club");
const Put = require("../models/put");
const User = require("../models/user");
const user = require("./user");
const clubs = require("./clubs");
const puts = require("./puts");
const { DB_DEV_URL } = require("../constants");
const mongoose = require("mongoose");

const createUser = async (user) => {
  const newUser = await User.create(user);
  console.log(`User created: ${newUser}`);
};

const clearDB = async () => {
  try {
    await deleteUsers();
    await deleteClubs();
    await deletePuts();
    console.log("Database cleared.");
  } catch (error) {
    throw error;
  }
};

const deleteUsers = async () => {
  console.log("Deleting users...");
  await User.deleteMany({});
};

const deleteClubs = async () => {
  console.log("Deleting clubs...");
  await Club.deleteMany({});
};

const deletePuts = async () => {
  console.log("Deleting puts...");
  await Put.deleteMany({});
};

const createClub = async (club) => {
  await Club.create(club);
};

const createClubs = async (clubs) => {
  for (let club of clubs) {
    try {
      await createClub(club);
    } catch (error) {
      throw error;
    }
  }
  console.log("Clubs created.");
};

const createPut = async (put) => {
  await Put.create(put);
};

const createPuts = async (puts) => {
  for (let put of puts) {
    try {
      await createPut(put);
    } catch (error) {
      throw error;
    }
  }
  console.log("Puts created.");
};

const closeConnection = () => {
  mongoose.connection.close();
  console.log("Database connection closed.");
};

const seedDB = async () => {
  try {
    await connectDB(DB_DEV_URL);
    await clearDB();
    await createUser(user);
    await createClubs(clubs);
    await createPuts(puts);
    console.log("Seeding complete!!!");
    closeConnection();
  } catch (error) {
    console.log(error);
    closeConnection();
  }
};

seedDB();
