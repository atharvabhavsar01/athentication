//jshint esversion:6

require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

// console.log(process.env.SECRET)

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

//database model
mongoose
  .connect('mongodb://localhost:27017/authUser1', { useNewUrlParser: true })
  .then(() => {
    console.log('connected database successfully');
  });

//schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//encrypting
// var secret = 'MyLittleSecret';
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

//model

const User = mongoose.model('user', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/secrets', (req, res) => {
  res.render('secrets');
});

app.get('/submit', (req, res) => {
  res.render('submit');
});

//post

app.post('/register', function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  // User.insertOne({
  //     email:emailN,
  //     password:pass
  // });

  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  console.log('data fethced from user');
  User.findOne({ username: username }, (err, foundONe) => {
    if (err) {
      console.log(err);
    } else {
      if (foundONe) {
        if (foundONe.password === password) {
          res.render('secrets');
        }
      }
    }
  });
});

app.listen(3000, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('server is running on port 3000');
  }
});
