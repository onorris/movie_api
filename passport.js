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

/*takes the LocalStrategy defined above to check that the username and password in the body of the request 
exist in the database. if they do -> use generateJWTTOekn to create a JWT. if they dont' exist -> error message*/
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //local passport file 

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //username that is encoded into JWT
        expiresIn: '7d', //token expires in 7 days//
        algorithm: 'HS256' //used to "sign" or encode the values of the JWT //
    });
}

//POST login//
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
        req.login(user, { session: false}, (error) => {
            if (error) {
                res.send(error);
            }
            let token = generateJWTToken(user.toJSON());
            return res.json({user, token}); //ES6 shorthand because keys are same as values i.e. user:user//
        });
        })(req, res);
    });
}