const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const promBundle = require("express-prom-bundle");
const config = require('./system-life');
const middlewares = require('./middleware');
const models = require('./models/medicine');


require('dotenv').config();

const APP_PORT = process.env.APP_PORT || "3001";

const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
    includeUp: true,
    promClient: {
        collectDefaultMetrics: {}
    }
});

app.use(middlewares.countRequests);
app.use(metricsMiddleware);
app.use(config.middlewares.healthMid);
app.use('/', config.routers);
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/medicines/new', (req, res) => {
    res.render('add-medicine');
});

app.post('/medicines', async (req, res) => {
    let valid = req.body.name.length > 0 && req.body.quantity > 0;

    if (valid) {
        await models.Medicine.create({ name: req.body.name, quantity: req.body.quantity });
        res.redirect('/');
    } else {
        res.render('add-medicine', { medicine: { name: req.body.name, quantity: req.body.quantity }, valido: false });
    }
});

app.get('/', async (req, res) => {
    const medicines = await models.Medicine.findAll();
    res.render('index', { medicines: medicines });
});

app.get('/medicines/:id', async (req, res) => {
    const medicine = await models.Medicine.findByPk(req.params.id);
    
    if (!medicine) {
        return res.status(404).json({ message: 'Medicamento não encontrado' });
    }
    
    res.render('medicine-detail', { medicine: medicine });
});

app.post('/medicines/:id', async (req, res) => {
    const medicine = await models.Medicine.findByPk(req.params.id);

    if (!medicine) {
        return res.status(404).json({ message: 'Medicamento não encontrado' });
    }

    await models.Medicine.destroy({ where: { id: req.params.id } });
    res.redirect('/');
});

models.initDatabase();
app.listen(APP_PORT);

console.log('Aplicação rodando na porta --> ' + APP_PORT);
