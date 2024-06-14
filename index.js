//integrates Mongoose and models.js into the API//
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/cfDB');

//imports the express module locally so it can be used //
const express = require('express');
    morgan = require('morgan'),
    fs = require('fs'), //import built in node modules fs and path 
    path = require('path');

//declares 'app' variable that encapsulates Express's functionality to configure your web server//
const app = express();

//uuid (universally unique identifier) module//
const uuid = require('uuid');
const { title } = require('process');

//create a write stream in append mode, and a log.txt file in the root directory//
//no longer using node built in modules 'fs' and 'path'//
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
const port = 8080

//express.static serves documentation.html file from the public folder//
app.use(express.static(path.join(__dirname, 'public')));

//setup the Middleware//
app.use(morgan('combined', {stream:accessLogStream}));


//GET requests//
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

//returns JSON object with list of all movies//
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//returns ALL data about single movie in JSON object format//
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({Title: req.params.Title})
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: "+ err);
    });
});

//Returns JSON data about a genre by name//
app.get('/movies/genre/:genreName', async (req, res) => {
    await Movies.findOne({"Genre.Name": req.params.genreName})
    .then((movie) => {
        res.json(movie.Genre);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send("Error: "+ err);
    });
});

//Returns JSON data about a director//
app.get('/movies/directors/:directorName', async (req, res) => {
    await Movies.findOne({"Director.Name": req.params.directorName})
    .then((movie) => {
        res.json(movie.Director);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send("Error: " + err);
    });
});

//Allow users to add a movie to their list of favorites//
app.put ('/users/id/:favorites', (req, res) => {
    res.send('Successful PUT request adding movie to Favorites List')
});

//Remove a movie from their list of favorites//
app.delete('/users/id/:favorites', (req, res) => {
    res.send('Successful DELETE request removing movie from Favorites List')
});

//Allows new users to register//
app.post('/users/id/:register', (req, res) => {
    res.send('Successful POST request adding user to site')
});

//Allow new users to update their user info (username)//
app.put('/users/:id', (req, res) => {
    res.send('Successful PUT request indicating that username is updated')
});

//Allow existing users to deregister (showing text that a user email has been removed)//
app.delete('/users/:id', (req, res) => {
    res.send('Successful DELETE request removing user from website')
});

//listen for requests
app.listen(port, () => {
    console.log(`API listening on port 8080`);
  });
