# goingup-xyz

## Getting started with the web app
1. Install nodejs from `https://nodejs.org/en/download/`
2. Install yarn globally with `npm install -g yarn`
3. Change into web app subdirectory with `cd web-app-2.0`
4. Install dependencies with `yarn install`
5. Start the web app with `yarn dev`
6. Open `http://localhost:3025` in your browser


## Using mongodump and mongorestore
```bash
mongodump --uri="mongodb+srv://username:password@cluster.tenant.mongodb.net/database"
```
username and password are the ones you use in compass to connect to the source database.
It will create dump directory with all collections you have.

Then you have to upload the backup to destination server and run
```bash
mongorestore --uri="mongodb+srv://username:password@cluster.tenant.mongodb.net/database" dump/
```