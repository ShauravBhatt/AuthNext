import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Database connected successfully !!");
    });

    connection.on("error", (err) => {
      console.log(
        "MongoDB connection error. Please make sure mongoDB is still running. ",
        err,
      );
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong !!");
    console.error(error);
  }
};
