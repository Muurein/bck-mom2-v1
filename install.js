//för att kunna använda env-filen
const { Client } = require("pg");
require("dotenv").config();

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

//skapa tabeller
client.query(`
    CREATE TABLE jobs(
    id SERIAL PRIMARY KEY NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    end_date DATE NOT NULL
    )
`);