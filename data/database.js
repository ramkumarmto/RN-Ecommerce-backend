import mongoose from "mongoose";

export const connectDB = async () => {
  // const conn = await mongoose.connect(`mongodb://127.0.0.1:27017/RN-ecommerce`, {
  //   const conn = await mongoose.connect(`mongodb://localhost:27017/RN-ecommerce`, { // local host giving error but 127.0.0.1 not. what the fuck!
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`server connected to database ${connection.host}`);
    // console.log("connection", connection);
  } catch (error) {
    console.log("some error occured", error.message);
    process.exit(1); // shut down the server when there would be any error
  }
};
