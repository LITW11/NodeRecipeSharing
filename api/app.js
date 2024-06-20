const express = require('express');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories.js');
const recipeRoutes = require('./routes/recipes.js');
const camelCaseDeep = require('camelcase-object-deep');
const { setupAuth, ensureAuthenticated } = require('./auth.js');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'LITRules@!',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(data) {
        originalJson.call(this, camelCaseDeep(data));
    };
    next();
});

setupAuth(app);

app.use('/api/account', userRoutes);
app.use('/api/categories', ensureAuthenticated, categoryRoutes);
app.use('/api/recipes', recipeRoutes);
// app.use('/api', routes);


app.listen(4000, () => console.log('server started'));