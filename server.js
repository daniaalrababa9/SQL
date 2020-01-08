'use strict';
//main
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

//sql
const client = new pg.Client(process.env.DATABASE_URL)
client.on('erorr', err => console.error(err));



//routes
app.get('/add', (req, res) => {
    let firstName = req.query.first;
    let lastName = req.query.last;
    let SQL = 'INSERT INTO people (first_name, last_name) VALUES ($1,$2)';
    let safeValues = [firstName, lastName];

    client.query(SQL, safeValues)
        .then(results => {
            res.status(200).send(results.rows);
        })
        .catch(erorr => erorrHandler(erorr));
})
app.get('/table', (req, res) => {
    let SQL = 'SELECT * FROM people'
    client.query(SQL)
        .then(results => {
            res.status(200).send(results.rows)
        })
        .catch(erorr => erorrHandler(erorr));
})
app.get('/test', (req, res) => {
    res.status(200).send('it works');
})

//erorr handlers
app.get('*', notFoundHandler)
app.use(erorrHandler)

function notFoundHandler(req, res) {
    res.status(404).send('not found');
}

function erorrHandler(error, req, res) {
    res.status(500).send(erorr);
}


//sql
client.connect()
    .then(() => {
        app.listen(PORT, () => console.log(`listen on ${PORT}`))
    })