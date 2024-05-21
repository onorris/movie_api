//imports the express module locally so it can be used //
const express = require('express');
    morgan = require('morgan'),
    fs = require('fs'), //import built in node modules fs and path 
    path = require('path');

//declares 'app' variable that encapsulates Express's functionality to configure your web server//
const app = express();

//uuid module//
const uuid = require('uuid');

//creatrs a write stream in append mode, and a log.txt file in the root directory//
//no longer useing node built in modules 'fs' and 'path'//
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
const port = 8080
const topTenMovies = 
    {movies: 
        ['Stranger Than Fiction',
        'Twilight',
        'The Challengers',
        'Renfield',
        'Nyad',
        'Nightmare Before Christmas',
        'The Greatest Showman',
        'Parasite',
        'Rent',
        'Everything Everywhere All At Once']}

//pulls movie data for Top Ten Movies//
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
})

//returns list of ALL movies//
app.get('/movies', (req, res) => {
    res.send('Successful GET request returnig data on all movies')
});

//returns data about single movie by description//
app.get('/movies/[description]', (req, res) => {
    res.send('Successful GET request returning data about movie by description')
});

////returns data about single movie by genre//
app.get('/movies/[genre]', (req, res) => {
    res.send('Successful GET request returning data about movie by genre')
});

////returns data about single movie by director name//
app.get('/movies/[director]', (req, res) => {
    res.send('Successful GET request returning data about movie by director')
});

//returns data about single movie by image URL//
app.get('/movies/[image]', (req, res) => {
    res.send('Successful GET request returning data about movie by image')
});

//returns data about single movie by featured or not featured//
app.get('/movies/[featured]', (req, res) => {
    res.send('Successful GET request returning data about movie by whether or not it is featured')
});

//returns data about genre when searching by name of movie//
app.get('/movies/[name]/genre', (req, res) => {
    res.send('Successful GET request returning data about genre of movie based on name')
});

//returns data about director by searching name of movie//
app.get('/movies/[name]/director', (req, res) => {
    res.send('Successful GET request returning data about director of movie based on name')
});

//Allow users to add a movie to their list of favorites (showing only a text that a movie has been added)//
app.put('/users/favorites', (req, res) => {
    res.send('Successful PUT request adding movie to list of favorites')
});
//CODE FROM 2.5 ASSIGNMENT EXAMPLE





//Code from 2.4 Assignment//
//text response of my choosing//
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

//express.static serves documentation.html file from the public folder//
app.use(express.static(path.join(__dirname, 'public')));

//setup the logger//
app.use(morgan('combined', {stream:accessLogStream}));

//code for errors //
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(port, () => {
    console.log(`API listening on port 8080`);
  });
