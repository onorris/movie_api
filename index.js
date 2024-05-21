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
// PUT CODE FROM 2.5 ASSIGNMENT EXAMPLE
// Update the "grade" of a student by student name/class name
//app.put('/students/:name/:class/:grade', (req, res) => {
 //   let student = students.find((student) => { return student.name === req.params.name });
  
   // if (student) {
     // student.classes[req.params.class] = parseInt(req.params.grade);
      //res.status(201).send('Student ' + req.params.name + ' was assigned a grade of ' + req.params.grade + ' in ' + req.params.class);
   // } else {
    //  res.status(404).send('Student with the name ' + req.params.name + ' was not found.');
   // }
 // });//

//Remove a movie from their list of favorites by name//
app.delete('/users/favorites', (req, res) => {
    res.send('Successful DELETE request removing movie to list of favorites')
});
//DELETE CODE FROM 2.5 ASSIGNMENT EXAMPLE 
// Deletes a student from our list by ID
//app.delete('/students/:id', (req, res) => {
  //  let student = students.find((student) => { return student.id === req.params.id });
  
    //if (student) {
      //students = students.filter((obj) => { return obj.id !== req.params.id });
      //res.status(201).send('Student ' + req.params.id + ' was deleted.');
   // }
 // });

//Allows new users to register//
app.post('/users'), (req, res) => {
    res.send('Successful POST request adding user to site')
};
//POST CODE FROM 2.5 ASSIGNMENT EXAMPLE
//app.post('/students', (req, res) => {
  //  let newStudent = req.body;
  
    //if (!newStudent.name) {
     // const message = 'Missing name in request body';
      //res.status(400).send(message);
    //} else {
      //newStudent.id = uuid.v4();
     // students.push(newStudent);
     // res.status(201).send(newStudent);
    //}
 // });

//Allow new users to update their user info (username)//
app.put('/users'), (req, res) => {
    res.send('Successful PUT request indicating that username is updated')
};

//Allow existing users to deregister (showing text that a user email has been removed)//
app.delete('/users', (req, res) => {
    res.send('Successful DELETE request removing user from website')
});

//Code from Previous 2.4 Assignment//
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
