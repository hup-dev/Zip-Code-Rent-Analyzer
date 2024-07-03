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
  return coordinates
}
async function getMortgageRates(zipcode) {
  const options = {
    method: 'GET',
    url: 'https://realty-in-us.p.rapidapi.com/finance/rates',
    params: {loc: zipcode},
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_REALTY_MOLE_API_KEY,
      'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
    }
  };
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}



const db = new sqlite3.Database("market_data.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the in-memory SQLite database.");

  db.run("CREATE TABLE market_data (zipcode TEXT PRIMARY KEY, data TEXT,last_updated DATE)", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to market_data table.");
    db.run("CREATE TABLE coordinates (zipcode TEXT PRIMARY KEY, data TEXT)", (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to coordinates table.");
    });
    db.run("CREATE TABLE mortgage_data (zipcode TEXT PRIMARY KEY, data TEXT)", (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to mortgage_data table.");
    });
  });
});

app.get("/market-data/:zipcode", (req, res) => {
  const zipcode = req.params.zipcode;
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`; // Format: YYYY-MM

  db.get("SELECT data, strftime('%Y-%m', last_updated) as last_updated_month FROM market_data WHERE zipcode = ?", [zipcode], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data.");
      return;
    }

    if (row && row.last_updated_month === currentMonth) {
      // Data for the current month exists, send it back
      res.json(JSON.parse(row.data));
    } else {
      // Fetch new data from the API
      const options = {
        method: "GET",
        url: `https://realty-mole-property-api.p.rapidapi.com/zipCodes/${zipcode}`,
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_REALTY_MOLE_API_KEY,
          "X-RapidAPI-Host": "realty-mole-property-api.p.rapidapi.com",
        },
      };
 
      axios.request(options).then((response) => {
          const data = response.data;
          res.json(data);

        if (row) {
          // Update existing entry with new data
          db.run("UPDATE market_data SET data = ?, last_updated = CURRENT_TIMESTAMP WHERE zipcode = ?", [JSON.stringify(data), zipcode], (err) => {
            if (err) console.error(err.message);
          });
        } else {
          // Insert new entry
          db.run("INSERT INTO market_data (zipcode, data, last_updated) VALUES (?, ?, CURRENT_TIMESTAMP)", [zipcode, JSON.stringify(data)], (err) => {
            if (err) console.error(err.message);
          });
        }
      }).catch((error) => {
          console.error(error);
          res.status(500).send("Error fetching data from the Realty Mole API.");
        });
    }
  });
});
app.get("/coordinates/:zipcode", async (req, res) => {
  const zipcode = req.params.zipcode;
  
  db.get("SELECT data FROM coordinates WHERE zipcode = ?", [zipcode], async (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data.");
    }

    if (row) {
      res.json(JSON.parse(row.data));
    } else {
      try {
        const coordinates = await getZipcodeCoordinates(zipcode);

        db.run("INSERT INTO coordinates (zipcode, data) VALUES (?, ?)", [zipcode, JSON.stringify(coordinates)], (err) => {
          if (err) {
            console.error(err.message);
          }
          // Send the response back to the client after inserting the data into the database
          res.json(coordinates);
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data from the coordinates API.");
      }
    }
      });
});
app.get("/mortgage_r/:zipcode", async (req, res) => {
  const zipcode = req.params.zipcode;
  
  db.get("SELECT data FROM mortgage_data WHERE zipcode = ?", [zipcode], async (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving data.");
    }

    if (row) {
      res.json(JSON.parse(row.data));
    } else {
      try {
        const mortgage_data = await getMortgageRates(zipcode);

        db.run("INSERT INTO mortgage_data (zipcode, data) VALUES (?, ?)", [zipcode, JSON.stringify(mortgage_data)], (err) => {
          if (err) {
            console.error(err.message);
          }
          // Send the response back to the client after inserting the data into the database
          res.json(mortgage_data);
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching data from the coordinates API.");
      }
    }
      });
});

app.listen  (PORT, () => {
  console.log(`Server listening on port ${PORT}`);
} );