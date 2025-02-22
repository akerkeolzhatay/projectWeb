const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const collection = require('./config');
const blogRoutes = require('../routes/blogRoutes'); 
const bmiRoutes = require('../routes/bmi'); 
const weatherRoutes = require('../routes/weather'); 
const qr = require('qrcode');

dotenv.config();

const app = express();
const port = process.env.PORT || 1212;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myApp')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('🟢 MongoDB connection is open');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`📩 [${req.method}] ${req.url}`);
    next();
});

app.use('/', blogRoutes);
app.use('/', weatherRoutes); 
app.use('/', bmiRoutes); 
app.use('/api', blogRoutes);

console.log('🔑 OpenWeather API Key:', process.env.OPENWEATHER_API_KEY || 'Not provided');
console.log('🔑 Google Maps API Key:', process.env.GOOGLE_MAPS_API_KEY || 'Not provided');
console.log('🔑 Unsplash API Key:', process.env.UNSPLASH_API_KEY || 'Not provided');

app.get('/', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/home', (req, res) => res.render('home'));
app.get('/bmi', (req, res) => res.render('bmi'));
app.get('/nodemailer', (req, res) => res.render('nodemailer'));
app.get('/weather', (req, res) => res.render('weather'));
app.get('/blog', (req, res) => res.render('blog'));

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('📝 Регистрация:', username);

        const existingUser = await collection.findOne({ name: username });
        if (existingUser) {
            return res.send('❌ User already exists. Please choose a different username.');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.time('⏳ Время добавления пользователя');
        const userData = await collection.insertMany([{ name: username, password: hashedPassword }]);
        console.timeEnd('⏳ Время добавления пользователя');

        console.log('✅ User registered:', userData);
        res.send(`✅ User registered successfully! Go to the <a href="/">LogIn page</a>`);
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('🔑 Вход:', username);

        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.send('❌ Username not found');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            res.render('home');
        } else {
            res.send('❌ Wrong password');
        }
    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        res.send('❌ Wrong details');
    }
});

app.post('/generate', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        console.log('❌ URL не передан');
        return res.render('qr', { qrCode: null });
    }

    try {
        const qrCode = await qr.toDataURL(url);
        console.log('✅ QR-код успешно создан');
        res.render('qr', { qrCode }); 
    } catch (error) {
        console.error('❌ Ошибка генерации QR-кода:', error);
        res.send('❌ Error generating QR code');
    }
});

app.get('/qr', (req, res) => res.render('qr', { qrCode: null }));

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
