const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db');

const app = express();

const PORT = 3009;

connectDB();

app.listen(PORT, () => console.log(`Server started, listening at port ${PORT}`));
