const { connectDB } = require("../helpers/database");
const mongoose = require("mongoose");

const { clubs, createClubs, deleteClubs } = require("./clubs");
const { user, createUser, deleteUsers } = require("./user");
const { deleteShots, createShots, associateShotsToClubs } = require("./shots");
const { puts, deletePuts, createPuts } = require("./puts");
const { DB_DEV_URL } = require("../constants");

const closeConnection = () => {
  mongoose.connection.close();
  console.log("Database connection closed.");
};

const clearDB = async () => {
  try {
    await deleteUsers();
    await deleteClubs();
    await deletePuts();
    await deleteShots();
    console.log("Database cleared.");
  } catch (error) {
    throw error;
  }
};

const seedDB = async () => {
  try {
    await connectDB(DB_DEV_URL);
    await clearDB();
    await createUser(user);
    await createClubs(clubs);
    await createPuts(puts);
    await createShots(clubs);
    await associateShotsToClubs(clubs);
    console.log("Seeding complete!!!");
    closeConnection();
  } catch (error) {
    console.log(error);
    closeConnection();
  }
};

seedDB();
