const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usersDb = require('./db/users');

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async function (email, password, done) {
    const user = await usersDb.login(email, password);
    if(user) {
        return done(null, user);
    }
    return done(null, false, {
        message: 'Incorrect login.'
    });
})); 

const setupAuth = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
}

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'invalid login' });
}

module.exports = {
    setupAuth,
    ensureAuthenticated
}