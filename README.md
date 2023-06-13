# goingup-xyz

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