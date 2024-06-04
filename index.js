//imports the express module locally so it can be used //
const express = require('express');
    morgan = require('morgan'),
    fs = require('fs'), //import built in node modules fs and path 
    path = require('path');

//declares 'app' variable that encapsulates Express's functionality to configure your web server//
const app = express();

//uuid (universally unique identifier) module//
const uuid = require('uuid');

//create a write stream in append mode, and a log.txt file in the root directory//
//no longer using node built in modules 'fs' and 'path'//
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
const port = 8080

//GET requests//
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

//Assignment 2.5//

//returns list of ALL movies//
app.get('/movies', (req, res) => {
    res.send('Successful GET request returning data on all movies')
});

//returns ALL data about single movie//
app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning data on single movie')
});

//Returns data about a genre by name//
app.get('movies/genre/:genreName', (req, res) => {
    res.send('Succesful GET request returning information about genre by name')
});

//Returns data about a director//
app.get('movies/directors/:directorName', (req, res) => {
    res.send('Succesful GET request returning information about a director')
});

//Allow users to add a movie to their list of favorites//
app.put ('users/id/:favorites', (req, res) => {
    res.send('Successful PUT request adding movie to Favorites List')
});

//Remove a movie from their list of favorites//
app.delete('users/id/:favorites', (req, res) => {
    res.send('Successful DELETE request removing movie from Favorites List')
});

//Allows new users to register//
app.post('users/:id'), (req, res) => {
    res.send('Successful POST request adding user to site')
};

//Allow new users to update their user info (username)//
app.put('users/:id'), (req, res) => {
    res.send('Successful PUT request indicating that username is updated')
};

//Allow existing users to deregister (showing text that a user email has been removed)//
app.delete('users/:id', (req, res) => {
    res.send('Successful DELETE request removing user from website')
});


//express.static serves documentation.html file from the public folder//
app.use(express.static(path.join(__dirname, 'public')));

//setup the Middleware//
app.use(morgan('combined', {stream:accessLogStream}));

//code for errors //
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

//listen for requests
app.listen(port, () => {
    console.log(`API listening on port 8080`);
  });
