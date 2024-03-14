const express = require('express')
const app = express()
const cors = require('cors')
let mongoose = require('mongoose')
let bodyParser = require('body-parser');
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI);
const Schema = mongoose.Schema;

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const exerciseSchema = mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date
});

const userSchema = mongoose.Schema({
  username: String
});

const logSchema = mongoose.Schema({
  username: String,
  count: Number,
  log: [{
    description: String,
    duration: Number,
    date: Date
  }]
});

const Excercise = mongoose.model('Excersice', exerciseSchema);
const User = mongoose.model('User', userSchema);
const Log = mongoose.model('Log', logSchema);

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  if (!username) return res.json({ "err": "Invalid name..."});

  let newUser = new User({ name: username });

  newUser.save().then(data => {
      res.json({
        username: username,
        _id: data._id.toString()
      });
    }).catch(err => {
      console.error(err);
      res.status(500).json({ "error": "An error occurred while saving the user." });
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
