import express, { json, urlencoded } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const app = express();
import cors from 'cors';
import { DBHOST, DBPORT, DATABASE, PORT, ADMINUSERNAME, ADMINUSERPASSWORD, ADMINUSEREMAIL } from './config/config.js';
import { errorHandler } from './config/error.handler.js';
import routes from './src/v1/router.js';
import { createDefaultUser } from './src/v1/controller/user/user.controller.js';
import {  } from "./config/job.schedule.js";
const { connect } = mongoose;

//Middleware
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: false }));
app.use(cors());

// DB connection
connect(`mongodb://${DBHOST}:${DBPORT}/${DATABASE}`)
    .then(() => {
        console.log('MongoDB connected');
        createDefaultUser(ADMINUSERNAME, ADMINUSERPASSWORD, ADMINUSEREMAIL);
    }).catch(err => console.error('MongoDB connection error:', err));

//API_routes
app.use('/v1', routes);
app.use(errorHandler);

// server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
}); 