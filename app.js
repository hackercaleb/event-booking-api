const express = require('express');
const globalErrorHandler = require('./controllers/errorcontroller');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/', routes);

app.use(globalErrorHandler);

module.exports = app;
