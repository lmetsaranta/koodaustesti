const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cors())

/* here we calculate the distance from latitude/longitude parameters from request body
* and we return the distance in kilometers */
app.post('/api/distance', (req, res) => {
    let lat1 = req.body.from.lat
    let lon1 = req.body.from.lon
    let lat2 = req.body.to.lat
    let lon2 = req.body.to.lon
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat2 - lat1) * p)/2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p))/2;

    let result = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
   res.json({distance: result});
})

app.listen(3001, () =>
    console.log('Express server is running on localhost:3001')
);