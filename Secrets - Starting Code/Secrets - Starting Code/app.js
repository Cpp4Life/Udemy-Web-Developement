require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption'); //encryption
// const md5 = require('md5'); //hashing
// const bcrypt = require('bcrypt'); //bcrypt
// const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'Little secret.',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] }); //encryption
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.route('/')
    .get((req, res) => {
        res.render('home');
    });

app.route('/auth/google')
    .get(passport.authenticate('google', {
        scope: ['profile']
    }));

app.route('/auth/google/secrets')
    .get(passport.authenticate('google', { failureRedirect: '/login' }),
        (req, res) => {
            res.redirect('/secrets');
        });

app.route('/secrets')
    .get((req, res) => {
        User.find({ "secret": { $ne: null } }, (err, foundUsers) => {
            if (err)
                console.log(err);
            else {
                if (foundUsers) {
                    res.render('secrets', { usersWithSecrets: foundUsers });
                }
            }
        });
    });

app.route('/submit')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render('submit');
        } else {
            res.redirect('/login');
        }
    })
    .post((req, res) => {
        const submittedSecret = req.body.secret;
        User.findById(req.user.id, (err, foundUser) => {
            if (err)
                console.log(err);
            else {
                if (foundUser) {
                    foundUser.secret = submittedSecret;
                    foundUser.save(() => {
                        res.redirect('/secrets');
                    });
                }
            }
        });
    });

app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        User.register({ username: req.body.username }, req.body.password, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect('/register');
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/secrets');
                });
            }
        });
    });
// .post((req, res) => {
//     bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
//         const newUser = new User({
//             email: req.body.username,
//             password: hash
//         });
//         newUser.save(err => {
//             if (!err)
//                 res.render('secrets');
//             else
//                 res.send(err);
//         })
//     });
// });

app.route('/login')
    .get((req, res) => {
        res.render('login');
    })
    .post((req, res) => {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        req.login(user, (err) => {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/secrets');
                });
            }
        });
    });
// .post((req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     User.findOne({ email: username, }, (err, foundUser) => {
//         if (err)
//             res.send(err);
//         else {
//             if (foundUser) {
//                 bcrypt.compare(password, foundUser.password, (err, result) => {
//                     if (result === true)
//                         res.render('secrets')
//                 });
//             }
//             else
//                 res.send('No user matched found!');
//         }
//     });
// });

app.route('/logout')
    .get((req, res) => {
        req.logout();
        res.redirect('/');
    });

app.listen(3000, () => console.log('Server running on port 3000'));