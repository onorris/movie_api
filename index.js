//imports the express module locally so it can be used //
const express = require('express');

//declares 'app' variable that encapsulates Express's functionality to configure your web server//
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

app.get('/movies', (req, res) => {
    res.json(topTenMovies);
})