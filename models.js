const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

//Hashing of submitted passwords//
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

//compares submitted hashed passwords with the hashed passwords stored in database//
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

//creates the models that use the defined schemas //
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//exports models//
module.exports.Movie = Movie;
module.exports.User = User;