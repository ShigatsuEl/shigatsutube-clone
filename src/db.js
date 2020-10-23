import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(
  process.env.PRODUCTION ? process.env.MONGO_PROD_URL : process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

const handleOpen = () => console.log("✅  Conneted to DB");

const handleError = (error) =>
  console.log(`❌  Error On DB Connection:${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
