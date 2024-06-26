const mongoose = require('mongoose');

//schema for documents in "Movies" collection//
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String, 
    Featured: Boolean
});

//schema for documents in "Users" collection//
let userSchema = mongoose.Schema({
    Username: {type: String, required:true},
    Password: {type: String, required:true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//creates the models that use the defined schemas //
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//exports models//
module.exports.Movie = Movie;
module.exports.User = User;