# Zip Code Rent Analyzer
This vite + react project allows the user to view data on various zipcodes. The data provided is from the Realty Mole API here: https://rapidapi.com/realtymole/api/realty-mole-property-api

Map data provided through OpenStreetMaps: https://wiki.openstreetmap.org/wiki/API

Chart.js is also used linked here: https://github.com/chartjs/

To run this on your own system, you don't need the API key. I have cached every entry I've done into market_data.db, a database with sqlite3, so that it can be used again without an API call.

## In Action
There's now a theme toggler between light and dark mode.

<img width="400" alt="Screenshot 2023-04-10 at 9 02 11 PM" src="https://user-images.githubusercontent.com/67870706/231028448-b1dc6a9f-7c01-482a-b79b-91b7ff468ccf.png">
<img width="400" alt="Screenshot 2023-04-10 at 9 02 36 PM" src="https://user-images.githubusercontent.com/67870706/231028492-a81f58f1-2954-4b4c-a59d-12328e1cfa0c.png">
<img width="648" alt="Screenshot 2023-04-09 at 12 16 26 AM" src="https://user-images.githubusercontent.com/67870706/230754127-3dd845ca-3d84-4322-962d-ea3bf688d753.png">

Now checks for valid input before performing tasks.


<img width="522" alt="Screenshot 2023-04-10 at 9 03 33 PM" src="https://user-images.githubusercontent.com/67870706/231028593-8f365794-c235-4da9-b12a-3c864913acdf.png">
<img width="588" alt="Screenshot 2023-04-10 at 9 03 11 PM" src="https://user-images.githubusercontent.com/67870706/231028603-f9ab5399-67f2-4cdd-94b9-264f8938caf9.png">

## Tutorial
First, Download the .zip file and unload it into a folder.

Install packages: 

`npm install`

Now, to run the server run: 

`node server/server.js`


and on a separate terminal window run:

`yarn run dev`

Once up and Running you may go to the localhost address provided to play around. 

NOTE: If you do not have the API Key for this project, use zipcodes in the market_data_db such as 10012, or 90210. 
## Future Plans

Also, this is still version one so it has some bugs and a lack of error handling. 

I plan on adding some more features such as:
* Valid zipcodes with no rent data currently crash the app
* Possibly support for a new API with more data
* Some customization on the user interface to select what they want
* Analysis and scoring of the zipcode rents to show growth, a buy rating, etc.
