# ZipCodeAnalyzer
This tool allows the user to view data on various zipcodes. The data provided is from the Realty Mole API here: https://rapidapi.com/realtymole/api/realty-mole-property-api

To run this on your own system, you don't need the API key. I have cached every entry I've done into market_data.db so that it can be used again without an API call.

## In Action

<img width="648" alt="Screenshot 2023-04-09 at 12 16 26 AM" src="https://user-images.githubusercontent.com/67870706/230754127-3dd845ca-3d84-4322-962d-ea3bf688d753.png">



## Tutorial
First, Download the .zip file and unload it into a folder.

Now, to run the server run: 

node server/server.js



and on a separate terminal window run:

yarn run dev

Once up and Running you may go to the localhost address provided to play around. 

NOTE: If you do not have the API Key for this project, use zipcodes in the market_data_db such as 10012, or 90210. Also, this is still version one so it has some bugs and a lack of error handling
