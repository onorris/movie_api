//imports the express module locally so it can be used //
const express = require('express');
    morgan = require('morgan'),
    fs = require('fs'), //import built in node modules fs and path 
    path = require('path');

//declares 'app' variable that encapsulates Express's functionality to configure your web server//
const app = express();

//creatrs a write stream in append mode, and a log.txt file in the root directory//
//no longer useing node built in modules 'fs' and 'path'//
const accessLogStream = fs.createWriteStream(path.join(_dirname, 'log.txt'), {flags: 'a'})
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

//setup the logger//
app.use(morgan('combined', {stream:accessLogStream}));

//displays text//
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

//pulls movie data//
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
})

//step 4 - express.static serves documentation.html file from the public folder//
app.use('/documentation.html', express.static('public'));;

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(port, () => {
    console.log(`API listening on port 8080`);
  });