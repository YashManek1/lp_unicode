import mongoose from "mongoose";

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

export default ConnectMongoDb;
