//initiera
const { Client } = require("pg");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

//startar appen
const app = express();
const port = process.env.PORT || 8000;

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
    
    //hämtar jobb
    client.query(`SELECT * FROM jobs`, (error, results) => {
        
        //om något går fel
        if(error) {
             res.status(500).json({error: "Something went wrong: " + error} );
             return;
        }

        //om det inte finns några jobb
        if(results.length === 0) {
            res.response(404).json( {message: "Inga jobb hittade"} );
        } else {
            res.json(results);
        }
    });
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

        //svarskod
        errors.https_response.message = "Bad request";
        errors.https_response.detail = "400";

        res.status(400).json(errors);

        //returnerar för att avsluta funktionen om inget går fel
        return;
    }

    //lägger till jobb till databas
    client.query(`INSERT INTO jobs(company_name, job_title, end_date, description) VALUES($1, $2, $3, $4)`,
        [companyName, jobTitle, endDate, description],
        (error, results) => {
            if(error) {
                res.status(500).json({error: "Something went wrong: " + error} );
                return;
            }

            console.log("Fråga skapad: " + results);

            let job = {
                companyName: companyName,
                jobTitle: jobTitle,
                endDate: endDate,
                description: description
            };

            res.json( {message: "jobb tillagt", job} );
        }
    );


});

app.put("/api/jobs/:id", (req, res) => {
    res.json( {message: "jobb uppdaterat: " + req.params.id } );
});

app.delete("/api/jobs/:id", (req, res) => {
    res.json( {message: "jobb raderat: " + req.params.id } );
});




app.listen(port, () => {
    console.log("Server startad på: " + port);
});