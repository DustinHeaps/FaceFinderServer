const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
// const leaderBoard = require('./controllers/leaderBoard');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('It is working');
});

app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.post('/changepassword', (req, res) => {
  profile.handlePasswordChange(req, res, db, bcrypt);
});

app.delete('/delete', (req, res) => {
  profile.deleteProfile(req, res, db, bcrypt);
});

app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.get('/leaderboard', (req, res) => {
  db.select('name', 'entries')
    .from('users')
    .orderBy('entries', 'desc')
    .limit(5)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => res.status(400).json('error getting leaderboard'));
});

// app.get('/leaderboard', (req, res) => {
//   leaderBoard.getLeaderboard(req, res, db);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
