const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB Connected`);
  } catch (error) {
    throw new Error(`Error Connecting to DB : ${error}`);
  }
};

module.exports = connectDB;
