// server/server.js
import * as dotenv from 'dotenv';
dotenv.config({ path: "./.env" });
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import sqlite3 from 'sqlite3';
sqlite3.verbose();

const app = express();
const PORT =  3030;

app.use(cors());

async function getZipcodeCoordinates(zipcode) {
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipcode}&countrycodes=US&format=json`;
  const response = await axios.get(url);
  const data = response.data;
  const coordinates = data[0]?.lat && data[0]?.lon ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
  return coordinates;
}


const db = new sqlite3.Database("market_data.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite database.");

  db.run("CREATE TABLE market_data (zipcode TEXT PRIMARY KEY, data TEXT)", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Created market_data table.");
  });
});

app.get("/market-data/:zipcode", (req, res) => {
  const zipcode = req.params.zipcode;

  db.get("SELECT data FROM market_data WHERE zipcode = ?", [zipcode], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data.");
    }

    if (row) {
      res.json(JSON.parse(row.data));
    } else {
      const options = {
        method: "GET",
        url: `https://realty-mole-property-api.p.rapidapi.com/zipCodes/${zipcode}`,
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_REALTY_MOLE_API_KEY,
          "X-RapidAPI-Host": "realty-mole-property-api.p.rapidapi.com",
        },
      };
 
      axios
        .request(options)
        .then((response) => {
          const data = response.data;
          res.json(data);

          db.run("INSERT INTO market_data (zipcode, data) VALUES (?, ?)", [zipcode, JSON.stringify(data)], (err) => {
            if (err) {
              console.error(err.message);
            }
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error fetching data from the Realty Mole API.");
        });
    }
  });
});
app.get("/coordinates/:zipcode", async (req, res) => {
  const zipcode = req.params.zipcode;

  try {
    const coordinates = await getZipcodeCoordinates(zipcode);

    if (coordinates) {
      res.json(coordinates);
    } else {
      res.status(404).send("No coordinates found for the given zipcode.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from the OpenStreetMap Nominatim API.");
  }
});

app.listen  (PORT, () => {
  console.log(`Server listening on port ${PORT}`);
} );