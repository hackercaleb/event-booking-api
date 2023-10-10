const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('unhandled rejection, shutting down');
  console.log(err.name, err.message);

  process.exit(1);
});
const app = require('./app');

const PORT = 3009;

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

//module.exports = connectDB;

connectDB();

app.listen(PORT, () => {
  console.log(`Server started, listening at port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection, shutting down');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
