import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import { index, store } from './controllers/CategoryController.js';

import indexRouter from './routes/index.js';

const env = dotenv.config().parsed;
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:8000',
}));

app.use('/', indexRouter);

//Connection to MongoDB
mongoose.connect(`${env.MONGODB_URI}${env.MONGODB_HOST}:${env.MONGODB_PORT}`, {
    dbName: env.MONGODB_DB_NAME
})

const db = mongoose.connection;

db.on('error', console.log.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Connected to MongoDB')
})

app.listen(env.APP_PORT, () => {
    console.log(`Server is running on port ${env.APP_PORT}`)
});