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
app.use(express.json()),
app.use(express.urlencoded({extended: true }));

//uuid (universally unique identifier) module//
const uuid = require('uuid');
const { title } = require('process');

//create a write stream in append mode, and a log.txt file in the root directory//
//no longer using node built in modules 'fs' and 'path'//
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
const port = 8080


//default text response//
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

//returns JSON object with list of all movies when at /movies //
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

//Returns JSON object of all users //
app.get("/users", function (req, res) {
    Users.find()
    .then(function (users) {
        res.status(201).json(users);
    })
    .catch(function(err) {
        console.error(err);
        res.status(500).send("Error: "+ err);
    });
});

//Allows new users to register//
/* JSON in this format:
{ID: integer
Username: String,
Password, String,
Email: String,
Birthday: Date
}*/
app.post("/users", async (req, res) => {
    await Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send((req.body.Username) + "already exists");
        } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday,
            })
            .then((user) => {
                res.status(201).json(user);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send("Error: " + err);
            })
        }
        })
    .catch((error) => {
        console.log(error);
        res.status(500).send("Error: "+ err);
    });
});

//Allow new users to update their user info (username)//
/* JSON in this format:
{Username: String, (required)
Password: String, (required)
Email: String, (required)
Birthday: Date}*/
//firt updates users with a certain username, then uses $set to specify which fields in the user document you're updating//
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate( {Username: req.params.Username},
        {$set:
            {Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
            }
        },
       {new: true}) //This line makes sure that the updated document is returned//
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    }) 
});

//Allow users to add a movie to their list of favorites//
app.put ('/users/id/:favorites', (req, res) => {
    res.send('Successful PUT request adding movie to Favorites List')
});

//Remove a movie from their list of favorites//
app.delete('/users/id/:favorites', (req, res) => {
    res.send('Successful DELETE request removing movie from Favorites List')
});

//Allow existing users to deregister (showing text that a user email has been removed)//
app.delete('/users/:id', (req, res) => {
    res.send('Successful DELETE request removing user from website')
});

//express.static serves documentation.html file from the public folder//
app.use(express.static(path.join(__dirname, 'public')));

//setup the Middleware//
app.use(morgan('combined', {stream:accessLogStream}));

//listen for requests
app.listen(port, () => {
    console.log(`API listening on port 8080`);
  });
