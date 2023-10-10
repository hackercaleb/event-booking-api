const express = require('express');
const mongoose = require('mongoose');
const AppError = require('./utils/apperror');
const globalErrorHandler = require('./controllers/errorcontroller');
const routes = require('./routes');
const Event = require('./model/eventmodel');
const { Error } = require('mongoose');

const app = express();

app.use(express.json());
app.use('/', routes);

app.all('*', (req, res, next) => {
  //res.status(404).json({
  //status: 'fail',
  //message: `cant find ${req.originalUrl} on this server`
  //});

  const err = new (Error(`cant find ${req.originalUrl} on this server`))();
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
