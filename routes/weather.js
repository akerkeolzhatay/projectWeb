const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

router.get('/api/weather', async (req, res) => {
    const city = req.query.city || 'London';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing OpenWeather API key' });
    }

    try {
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        const weatherData = weatherResponse.data;
        const { lat, lon } = weatherData.coord;
        const pressure = weatherData.main?.pressure ?? 'N/A'; // Если нет давления, вернуть 'N/A'

        let aqi = 'N/A';
        try {
            const aqiResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
            );
            aqi = aqiResponse.data?.list?.[0]?.main?.aqi ?? 'N/A';
        } catch (aqiError) {
            console.error('AQI API error:', aqiError.message);
        }

        const countryCode = weatherData.sys.country;
        let countryFlag = `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`; // Загружаем флаг по ISO-коду

        res.json({
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            feels_like: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            wind_speed: weatherData.wind.speed,
            pressure: pressure,
            aqi: aqi,
            country_code: countryCode,
            country_flag: countryFlag,
            coordinates: { lat, lon },
        });
    } catch (error) {
        console.error('Weather API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

router.get('/api/map', async (req, res) => {
    const location = req.query.location || 'Paris';
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing Google Maps API key' });
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
        );

        if (!response.data.results.length) {
            console.error(`Map Error: No results for "${location}"`);
            return res.status(404).json({ error: 'Location not found. Try using another city name.' });
        }

        const coordinates = response.data.results[0].geometry.location;
        res.json({ lat: coordinates.lat, lon: coordinates.lng });
    } catch (error) {
        console.error('Google Maps API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error fetching map data' });
    }
});


router.get('/api/fact', async (req, res) => {
    try {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        res.json({ fact: response.data.text });
    } catch (error) {
        console.error('Fact API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error fetching fact data' });
    }
});

router.get('/api/image', async (req, res) => {
    const apiKey = process.env.UNSPLASH_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing Unsplash API key' });
    }

    try {
        const response = await axios.get('https://api.unsplash.com/photos/random', {
            headers: { Authorization: `Client-ID ${apiKey}` },
        });

        if (!response.data?.urls) {
            return res.status(500).json({ error: 'Invalid Unsplash API response' });
        }

        res.json({ image: response.data.urls.regular });
    } catch (error) {
        console.error('Unsplash API error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error fetching image data' });
    }
});

router.get('/weather', (req, res) => {
    res.render('weather'); 
});

module.exports = router;
