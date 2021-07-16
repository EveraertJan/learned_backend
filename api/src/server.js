const express = require('express')
const bodyParser = require('body-parser');
const http = require('http');
const Helpers = require('./utils/helpers.js')
const databaseHelpers = require('./utils/databaseHelpers.js');
const courseEndpoints = require('./endpoints/courses.js');
const subjectEndpoints = require('./endpoints/subjects.js');
const contentBlockEndpoints = require('./endpoints/contentBlock.js');
const port = 3000

const pg = require('knex')({
  client: 'pg',
  version: '9.6',      
  searchPath: ['knex', 'public'],
  connection: process.env.PG_CONNECTION_STRING ? process.env.PG_CONNECTION_STRING : 'postgres://example:example@localhost:5432/test'
});


const app = express();
http.Server(app); 


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);  


function constructEndpoints() {

  app.get('/', (req, res) => {
    res.status(201).send({message: "hello world"});
  })
  courseEndpoints(app, pg);
  subjectEndpoints(app, pg);
  contentBlockEndpoints(app, pg);

}

databaseHelpers.initialiseTables(pg);
constructEndpoints();


module.exports = app;