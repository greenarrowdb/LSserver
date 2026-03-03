

## Server:

### Assumptions and prerequisites
The server assumes a postgres database called `loanstreetTestDB` exists.

### Install / Setup
The connection configuration information for the above database should be added to `/db_config.json`.

Run the contents `database.sql` against the database using your tool of choice to set up the table the server wants.

`npm install`

### Run
The server was built using node 24.14.0 and can be run using 
`node server.js`

### Swagger
Once running the server has swagger setup for docs and testing on [localhost:3000/docs/](http://localhost:3000/docs/)

## Client:

`client.js`

- The client file can be imported into other code and the three functions exposed can be used that way.
- In a more professional setting this client would be packaged up in a more intentional way (obviously).
- The client is currently not configurable and relies on localhost, but that is easily changeable.
- An example of using the client in this incarnation can be seen in `client_test.js`