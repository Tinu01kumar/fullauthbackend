import express from "express";
import cors from "cors";

import dotenv from 'dotenv';
import bodyParser from "body-parser";


import connection from "./config/db.js";
import Router from "./Router/route.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.static('public'));

app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));

app.use('/' , Router)


const PORT = process.env.PORT || 9000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

connection(username, password);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));

