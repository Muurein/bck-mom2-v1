//initiera
const { Client } = require("pg");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

//startar appen
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded( {extended: true } ));
app.use(express.json());
app.use(cors());

//ansluter till databasen
const client = new Client ({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    //måste vara med i ej-betal-versionen eftersom man inte har tillgång till krypterad kod
    ssl: {
        rejectUnauthorized: false,
    },
});

//felmeddelande
client.connect((error) => {
    if(error) {
        console.log("Anslutningsfel: " + error)
    } else {
        console.log("Ansluten till databasen!");
    }
});


//Routes
app.get("/api/jobs")