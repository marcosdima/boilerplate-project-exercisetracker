const express = require('express')
const app = express()
const cors = require('cors')
let mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const exerciseSchema = mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId // Utiliza mongoose.Types.ObjectId para generar un ObjectId aleatorio por defecto
  },
  username: String,
  description: String,
  duration: Number,
  date: Date
});

const userSchema = mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId // Utiliza mongoose.Types.ObjectId para generar un ObjectId aleatorio por defecto
  },
  username: String
});

const logSchema = mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId // Utiliza mongoose.Types.ObjectId para generar un ObjectId aleatorio por defecto
  },
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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
