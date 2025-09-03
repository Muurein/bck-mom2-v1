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
app.get("/api", (req, res) => {
    res.json( { message: "api funkar"} );
});

app.get("/api/jobs", (req, res) => {
    res.json( {message: "hämtar jobb"} );
});

app.post("/api/jobs", (req, res) => {
    let companyName = req.body.companyName;
    let jobTitle = req.body.jobTitle;
    let endDate = req.body.endDate;
    let description = req.body.description;

    //errors
    let errors = {
        message: "",
        detail: "",
        https_response: {

        }
    };

    //felmeddelanden
    if(!companyName || !jobTitle || !endDate || !description) {
        //felmeddelanden
        errors.message = "Fyll i alla fält";
        errors.detail = "Skriv in företagsnamn, jobbtitel, slutdatum och beskrivning i JSON";


        res.status(400).json(errors);

        //returnera för att avsluta funktionen om inget går fel
        return;
    }

    let job = {
        companyName: companyName,
        jobTitle: jobTitle,
        endDate: endDate,
        description: description
    };

    res.json( {message: "jobb tillagt", job} );
});

app.put("/api/jobs/:id", (req, res) => {
    res.json( {message: "jobb uppdaterat: " + req.params.id } );
});

app.delete("/api/jobs/:id", (req, res) => {
    res.json( {message: "jobb raderat: " + req.params.id } );
});




app.listen(process.env.PORT, () => {
    console.log("Server startad på: " + process.env.PORT);
});