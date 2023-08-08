const { connectDB } = require("../helpers/database");
const mongoose = require("mongoose");
require("dotenv").config();

const { clubs, createClubs, deleteClubs } = require("./clubs");
const { greens, createGreens, deleteGreens } = require("./greens");
const { fairways, createFairways, deleteFairways } = require("./fairways");
const { user, createUser, deleteUsers } = require("./user");
const { deleteShots, createShots, associateShotsToClubs } = require("./shots");
const { puts, deletePuts, createPuts } = require("./puts");

const closeDbConnection = () => {
  mongoose.connection.close();
  console.log("Database connection closed.");
};

const clearDB = async () => {
  try {
    await deleteUsers();
    await deleteClubs();
    await deletePuts();
    await deleteShots();
    await deleteGreens();
    await deleteFairways();
    console.log("Database cleared.");
  } catch (error) {
    throw error;
  }
};

const seedDB = async () => {
  try {
    if (!process.env.DB_PROD_URL) {
      console.log("Unable to seed production!");
    }
    console.log("Seeding production database");
    await connectDB(process.env.DB_PROD_URL);
    await clearDB();
    await createUser(user);
    await createClubs(clubs);
    await createPuts(puts);
    await createShots();
    await createGreens(greens);
    await associateShotsToClubs(clubs);
    await createFairways(fairways);
    console.log("Seeding complete!!!");
    closeDbConnection();
  } catch (error) {
    console.log(error);
    closeDbConnection();
  }
};

seedDB();
