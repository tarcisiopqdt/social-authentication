const express = require('express');
const app = express();
const session = require('express-session');
const authRouter = require('./src/controllers/google-auth');
const facebookRouter = require('./src/controllers/facebook-auth');
const githubRouter = require('./src/controllers/github-auth');
const protectedRouter = require('./src/controllers/protected-route');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');

require('dotenv').config();

app.set('view engine', 'ejs');

const connectToMongoDb = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDb..'))
    .catch((error) => {
      console.log('Error in connecting to mongoDB ' + error);
      throw error;
    });
};
connectToMongoDb();
app.use(flash());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {cb(null, user);});
passport.deserializeUser(function (obj, cb) {cb(null, obj);});

app.get('/', (req, res) => { res.render('auth');});
app.get('/privacy', (req, res) => {  res.render('privacy')}); // Renderiza a página privacy.ejs
app.get('/home', (req, res) => {  res.render('auth')});// Renderiza a página privacy.ejs

app.use('/auth/facebook', facebookRouter); // app.use('/auth/google', authRouter);
app.use('/protected', protectedRouter);// app.use('/auth/github', githubRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port http://localhost:' + port));
