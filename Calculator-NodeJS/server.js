const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get('/bmicalculator', (req, res) => {
    res.sendFile(__dirname + '/bmiCalculator.html');
});

app.post('/bmicalculator', (req, res) => {
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var BMI = Math.round(weight / Math.pow(height, 2));

    res.send(`You weigh ${weight}kg<br>Your height is ${height}m<br>Your BMI is ${BMI}`);
});

app.listen(port, () => {
    console.log("App is running on server port 3000");
});