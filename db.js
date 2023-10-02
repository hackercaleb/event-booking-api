const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const clusterName = process.env.MONGO_CLUSTER_NAME;

const url = `mongodb+srv://${username}:${password}@${clusterName}.dqdxx7i.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(url, { useNewUrlParser: true });
    console.log('MongoDB Atlas Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
};

module.exports = connectDB;
