const express = require('express');
const https = require('https');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const query = req.body.cityName;
    const apiKey = 'bee95a78ebd4aa7cd2438af502ab7cdf';
    const unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey + '&units=' + unit;

    https.get(url, (response) => {
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);

        response.on('data', (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            res.write(`<h1>The temperature in ${query} is ${temp} degrees Celcius</h1>`);
            res.write(`<p>The weather is currently ${weatherDescription}</p>`);
            res.write(`<image src=${imageURL}>`);
            res.send();
        });
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});