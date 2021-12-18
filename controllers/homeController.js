fetch = require('cross-fetch')

module.exports = {
    index: (req,res) => {
        res.render("index", {labels: res.locals.x, values: res.locals.y, highest: Math.max(...res.locals.y), highestDate: res.locals.yDate, bearings: res.locals.bearings})
    },
    formatForChart: (req, res, next) => {
        let prices = res.locals.data.prices
        let xLabels = [];
        let yValues = [];
        let d = "";
        prices.forEach(item => {
            let timeStamp = parseInt(item[0]);
            let toMill = timeStamp;
            let dateObj = new Date(toMill)
            if (d == dateObj.getUTCDate()) {
                return;
            } else {
                d = dateObj.getUTCDate();
                xLabels.push(item[0])
                yValues.push(item[1])
            }
        })
        res.locals.x = xLabels;
        res.locals.y = yValues;
        next();
    },
    calcBearAndHigh: (req, res, next) => {
        let x = res.locals.x;
        let y = res.locals.y;
        let count = 0;
        let maxBearing = 0;
        let bearStart = "";
        let bearEnd = "";
        let bearEndValue = 0;
        let bearStartValue = 0;
        // calculate longest bearing
        for (let i = 0; i < y.length; i++) {
            if ( y[i] > y[i+1] ) {
                count += 1
            } else {
                if (count > maxBearing) {
                    maxBearing = count
                    bearStart = x[i-count]
                    bearEnd = x[i]
                    bearStartValue = y[i-count]
                    bearEndValue = y[i]
                }
                count = 0
            }
        }
        let bearings = [maxBearing, bearStart, bearEnd, bearStartValue, bearEndValue]
        res.locals.yMax = Math.max(...res.locals.y);
        let timeStamp = parseInt(x[y.indexOf(Math.max(...res.locals.y))]);            
        let toMill = timeStamp;
        let dateObj = new Date(toMill)
        let yDateString = dateObj.toLocaleDateString("en-US", {timeZone: 'UTC'})
        res.locals.yDate = yDateString
        res.locals.bearings = bearings;
        next()
    },
    getData: async (req, res, next) => {
            let from = res.locals.from
            let to = res.locals.to
        fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=${from}&to=${to}`)
        .then(resp => {
            return resp.json()
        })
        .then(data => {
            res.locals.data = data;
            next();
        })
    },
    getParams: (req, res, next) => {
        let dateParams = {
            start: req.body.startdate,
            end: req.body.enddate
        }
        let startUnix = Math.floor(new Date(dateParams.start).getTime()/1000)
        let endUnix = Math.floor(new Date(dateParams.end).getTime()/1000)
        res.locals.from = startUnix;
        res.locals.to = endUnix + 3600;
        next();
    }
}