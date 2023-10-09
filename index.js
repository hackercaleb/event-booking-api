const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db');
const AppError = require('./utils/apperror ');
const globalErrorHandler = require('./controllers/errorcontroller');

const app = express();

const PORT = 3009;

connectDB();

app.listen(PORT, () => console.log(`Server started, listening at port ${PORT}`));

app.use(express.json());

app.use((err, req, res, next) => {
  globalErrorHandler;
});
