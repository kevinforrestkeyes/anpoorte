import mongoose, { Mongoose } from 'mongoose';

const dotenv = require('dotenv').config();

const dbUri = process.env.DB_URI;

mongoose.connect(dbUri);
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'mongodb connection error'));

export default db;