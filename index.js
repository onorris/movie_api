//integrates Mongoose and models.js into the API//
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//mongodb+srv://oliviagdewald:Threeonetwo@odndb.jdewx7k.mongodb.net/?retryWrites=true&w=majority&appName=OdNdB//
mongoose.connect('mongodb+srv://oliviagdewald:Threeonetwo93!@odndb.jdewx7k.mongodb.net/OdNdB?retryWrites=true&w=majority&appName=OdNdB');
//mongoose.connect(process.env.CONNECTION_URI);//


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

//imports auth.js, passport file and cors into project//
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

//step 1 assignment 2.10 - implement CORS so that all domains are allowed to make requests to API//
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors());

//requires express-validator//
const { check, validationResult} = require('express-validator');

//create a write stream in append mode, and a log.txt file in the root directory//
//no longer using node built in modules 'fs' and 'path'//
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

//default text response//
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

//returns JSON object with list of all movies when at /movies //
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), (req, res) => {
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
app.get('/movies/genre/:genreName', passport.authenticate('jwt', {session: false}), async (req, res) => {
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
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), async (req, res) => {
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
app.get("/users", passport.authenticate('jwt', {session:false}), function (req, res) {
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
app.post("/users", 
    //validation logic here//
    [check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()],
    async (req, res) => {
    //check the validation object for errors//
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    let hashedPassword = Users.hashedPassword(req.body.Password);

    //search to see if user with the requested username already exists//
    await Users.findOne({Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send((req.body.Username) + "already exists");
        } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
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
//first updates users with a certain username, then uses $set to specify which fields in the user document you're updating//
app.put('/users/:Username', passport.authenticate('jwt', {session:false}),
    [//validation logic here//
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

    //Checks for validation errors//
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    //Condition to check if same user is making the PUT request//
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
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

//Allow existing users to deregister/delete (showing text that a user email has been removed)//
app.delete('/users/:Username', passport.authenticate('jwt', {session:false}), async (req, res) => {
   await Users.findOneAndDelete({Username: req.params.Username})
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + " was not found");
        } else {
            res.status(200).send(req.params.Username + " was deleted.");
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//Allow users to add a movie to their list of favorites//
app.post ('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session:false}), async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username},
    {$push: {FavoriteMovies: req.params.MovieID}
    },
    {new: true}) //Makes sure updated doument is returned
    .then((updatedUser) => {
        res.json(updatedUser);
        })
    .catch((err) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});


//Remove a movie from their list of favorites//
app.delete ('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session:false}), async (req, res) => {
    await Users.findOneAndUpdate({Username: req.params.Username},
    {$pull: {FavoriteMovies: req.params.MovieID}
    },
    {new: true}) //Makes sure updated doument is returned
    .then((updatedUser) => {
        res.json(updatedUser);
        })
    .catch((err) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//express.static serves documentation.html file from the public folder//
app.use(express.static(path.join(__dirname, 'public')));

//setup the Middleware//
app.use(morgan('combined', {stream:accessLogStream}));

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on Port ` + port);
  });
