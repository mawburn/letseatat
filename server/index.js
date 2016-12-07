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
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  let lat = req.body.lat
  let long = req.body.long

  searchPlaces(`location=${lat},${long}&rankby=prominence&opennow=true&radius=8500&type=restaurant&key=${googleKey}`)
    .then(resp => {
      res.send(resp)
    })
})

app.listen(port, () => {
  console.log()
})

async function searchPlaces(params) {
  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?`
  const page1 = await fetch(`${baseUrl}${params}`).then(res => res.json())
  await sleep(1500) // fucking Google API timeout
  const page2 = await fetch(`${baseUrl}pagetoken=${page1['next_page_token']}&key=${googleKey}`).then(res => res.json())
  await sleep(1500) // uggg
  const page3 = await fetch(`${baseUrl}pagetoken=${page2['next_page_token']}&key=${googleKey}`).then(res => res.json())
  
  const output1 = await page1.results.map((place) => {
    let weight = Math.round(place.rating)
    return { name: place.name, weight}
  })

  const output2 = await page2.results.map((place) => {
    let weight = Math.round(place.rating)
    return { name: place.name, weight}
  })

  const output3 = await page3.results.map((place) => {
    let weight = Math.round(place.rating)
    return { name: place.name, weight}
  })

  let output = output1.concat(output2).concat(output3)

  return output.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj.name).indexOf(obj.name) === pos;
  })
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

