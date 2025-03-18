const express = require('express');
const router = express.Router();

router.get('/controlPanel', (req, res) => {
    res.render('controlPanel', { activePage: 'controlPanel'});
});

router.get('/', (req, res) => {
    res.render('robotStatus', { activaPage: 'robotStatus'});
});

router.get('/operations', (req, res) => {
    res.render('operations', { activePage: 'operations'});
});

router.get('/logs', (req, res) => {
    res.render('logs', { activePage: 'logs'});
});

router.get('/calibration', (req, res) => {
    res.render('calibration', { activePage: 'calibration'});
});

router.get('/label', (req, res) => {
    res.render('label', { activePage: 'label' });
});


module.exports = router;
