fetch = require('cross-fetch')

module.exports = {
    index: (req,res) => {
        res.render("index", {labels: res.locals.x, values: res.locals.y})
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
        let yMax = Math.max(...y)
        let maxLow = 0;
        // calculate longest bearing
        res.locals.yMax = yMax;
        res.locals.lBear = maxLow;
        console.log(yMax)
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