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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
    console.log('MongoDB Atlas Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
};

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server started, listening at port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled rejection, shutting down');
  console.log(err.name, err.message, err.stack);

  server.close(() => {
    process.exit(1);
  });
});
