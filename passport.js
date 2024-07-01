const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy= passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//defines basic HTTP authentication for login requests - takes username and password from request body and uses
//Mongoose to check database for user with the same username. If matched, callback function executed//
passport.use(
    new LocalStrategy(
    {
        usernameField: 'Username',
        passwordField: 'Password',
    },
    async (username, password, callback) => {
        console.log(`${username} ${password}`);
        await Users.findOne({ Username: username })
        .then((user) => {
            if (!user) {
                console.log('incorrect username');
                return callback(null, false, {
                    message: 'Incorrect username or password.',
                })};
            })
        console.log('finished');
        return callback(null, user);
        })
        .catch((error) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
        })
);

//Authenticates users based on the JWT submitted with their request//
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'},
    async(jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));