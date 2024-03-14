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
  date: String
});

const userSchema = mongoose.Schema({
  username: String
});

const Excercise = mongoose.model('Excersice', exerciseSchema);
const User = mongoose.model('User', userSchema);

app.post("/api/users", (req, res) => {
  const username = req.body.username;

  if (!username) return res.json({ "err": "Invalid name..."});

  let newUser = new User({ username: username });

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

app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;

  const { username } = await User.findOne({ _id: id })
    .catch(err => {
      console.error(err);
      res.status(500).json({ "error": "An error occurred while getting user." });
  });;

  let date;
  if (!req.body.date) date = new Date();
  else date = new Date(req.body.date);

  const options = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  };
  date = date.toLocaleDateString('en-US', options).replace(/,/g, '');  
  

  const exData = {
    username: username,
    description: req.body.description,
    duration: Number(req.body.duration),
    date: date
  };
  const ex = new Excercise(exData);

  ex.save().then(data => {
      exData['_id'] = id;
      res.json(exData);
    }).catch(err => {
      console.error(err);
      res.status(500).json({ "error": "An error occurred while saving the user." });
  });
});

app.get("/api/users", async (req, res) => {
  const data = await User.find({}, 'username')
    .catch(err => {
      console.error(err);
      res.status(500).json({ "error": "An error occurred while getting users." });
  });
  res.json(data);
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id;

  const { username } = await User.findOne({ _id: id })
    .catch(err => {
      console.error(err);
      res.status(500).json({ "error": "An error occurred while getting user." });
  });;

  const exs = await Excercise.find({ username: username })
    .catch(err => {
      console.error(err);
      res.status(500).json({ "error": "An error occurred while getting user." });
  });

  const log = exs.map(
    element => { 
      return {
        description: element.description,
        duration: element.duration,
        date: element.date
      }
  });
  
  res.json({
    username: username,
    count: log.length,
    _id: id,
    log: log
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
