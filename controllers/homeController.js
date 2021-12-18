fetch = require('cross-fetch')

module.exports = {
    index: (req, res) => {
        let prices = res.locals.data.prices
        let xLabels = [];
        let yValues = [];

        // List prices and dates to separate lists to render in chart
        // Also convert unix timestamp to date

        prices.forEach(item => {
            let timeStamp = parseInt(item[0]);
            let toMill = timeStamp;
            let dateObj = new Date(toMill)
            let label = dateObj.toLocaleDateString("en-US", {timeZone: 'UTC'})
            xLabels.push(label)
            yValues.push(item[1])
        })
        console.log(xLabels)
        res.render("index", {labels: xLabels, values: yValues})
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
        res.locals.from = "1577836800";
        res.locals.to = "1609376400";
        next();
    }
}