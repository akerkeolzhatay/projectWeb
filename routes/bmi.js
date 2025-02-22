const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.get('/bmi', (req, res) => {
    res.render('bmi'); 
});

router.post('/calculate-bmi', (req, res) => {
    const { weight, height } = req.body;

    if (!weight || !height || weight <= 0 || height <= 0) {
        return res.send(`<h3 style="color: red;">Invalid input. Please provide positive numbers for weight and height.</h3>`);
    }

    const bmi = (weight / (height * height)).toFixed(2);
    let category = '';

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 18.5 && bmi < 24.9) category = 'Normal weight';
    else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
    else category = 'Obese';

    res.send(`<h3>Your BMI: ${bmi}</h3>
              <h3 style="color: ${category === 'Normal weight' ? 'green' : category === 'Overweight' ? 'yellow' : 'red'};">Category: ${category}</h3>
              <a href="/bmi">Back to Calculator</a>`);
});

module.exports = router;
