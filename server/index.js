var server = require('express')
var app = server()
var port = process.env.PORT || 4242
var bodyParser = require('body-parser')
var fetch = require('isomorphic-fetch')
require('dotenv').config()
var googleKey = process.env.GOOGLE_KEY
var winston = require('winston')
require('winston-daily-rotate-file')

var transport = new winston.transports.DailyRotateFile({
    filename: './log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: 'info'
  })

var logger = new (winston.Logger)({
    transports: [
      transport
    ]
  })



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', (req, res) => {
  var lat = req.body.lat
  var long = req.body.long
  var type = req.body.type

  console.log(lat, long, type)
  logger.info({message: {lat, long, type}})

  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=8500&type=restaurant&keyword=${type}&key=${googleKey}`)
    .then(gRes => {
      return gRes.json()
    })
    .then(json => {
      res.send(json)
    })
})

app.listen(port, () => {
  console.log()
})
