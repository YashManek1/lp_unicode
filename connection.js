const mongoose = require("mongoose");

async function ConnectMongoDb(URL) {
  mongoose
    .connect(URL)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  ConnectMongoDb,
};
