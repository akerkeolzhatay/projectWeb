const express = require('express');
const qr = require('qrcode');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('qr', { qrCode: null });
});

router.post('/generate', async (req, res) => {
    const url = req.body.url;
    if (!url) return res.render('qr', { qrCode: null });

    try {
        const qrCode = await qr.toDataURL(url);
        res.render('qr', { qrCode });
    } catch (err) {
        res.send('Error generating QR code');
    }
});

module.exports = router;
