//imports the express module locally so it can be used //
const express = require('express');

//declares 'app' variable that encapsulates Express's functionality to configure your web server//
const app = express();
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
//displays text//
app.get('/', (req, res) => {
    res.send('Welcome to my Movie Club!');
})

//pulls movie data//
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })