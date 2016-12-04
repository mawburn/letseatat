var server = require('express')
var app = server()
var port = process.env.PORT || 4242
var bodyParser = require('body-parser')
var fetch = require('isomorphic-fetch')
require('dotenv').config()
var googleKey = process.env.GOOGLE_KEY
var winston = require('winston')
require('winston-daily-rotate-file')
var RateLimit = require('express-rate-limit');
var fs = require('fs')
var logDir = './logs'

if(!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

var transport = new winston.transports.DailyRotateFile({
    filename: `${logDir}/log`,
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: 'info'
  })

var logger = new (winston.Logger)({
    transports: [
      transport
    ]
  })

var limiter = new RateLimit({
  windowMs: 10*60*1000,  
  max: 100, 
  delayMs: 500 
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(limiter)

app.post('/', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  var lat = req.body.lat
  var long = req.body.long
  var type = req.body.type

  logger.info({message: {ip, lat, long, type}})

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
