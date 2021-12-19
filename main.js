const express = require("express"),
homeController = require("./controllers/homeController"),
layout = require("express-ejs-layouts"),
app = express();

app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
app.use(layout);

app.get("/", homeController.getParams, homeController.getData, homeController.formatForChart, homeController.calcBearAndHigh, homeController.index);
app.post("/", homeController.getParams, homeController.getData, homeController.formatForChart, homeController.calcBearAndHigh, homeController.index)

app.listen(app.get("port"), () => {
    console.log(`Server started, running in: http://localhost:3000`)
})