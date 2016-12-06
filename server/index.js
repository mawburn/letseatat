const fs = require('fs')
const server = require('express')
const bodyParser = require('body-parser')
const fetch = require('isomorphic-fetch')
const RateLimit = require('express-rate-limit')
const winston = require('winston')
const cors = require('cors')
require('dotenv').config()
require('winston-daily-rotate-file')

const app = server()
const port = process.env.PORT || 4242
const googleKey = process.env.GOOGLE_KEY
const logDir = './logs'

if(!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const transport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/log`,
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: 'info'
})

const logger = new (winston.Logger)({
  transports: [transport]
})

const limiter = new RateLimit({
  windowMs: 10*60*1000,  
  max: 20, 
  delayMs: 1000 
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(limiter)
app.use(cors())

app.post('/', (req, res) => {
  console.log(req.body)
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  let lat = req.body.lat
  let long = req.body.long

  logger.info({message: {ip, lat, long}})

  fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&rankby=prominence&opennow=true&radius=8500&type=restaurant&key=${googleKey}`)
    .then(gRes => gRes.json())
    .then(json => {
      let newData = json.results.map(place => {
        let weight = Math.round(place.rating) || 2
        return {name: place.name, weight}
      })

      Promise.all(newData).then(() => {
        res.send(newData)
      })
    })
})

app.listen(port, () => {
  console.log()
})
