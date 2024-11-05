const express = require('express');
const morgan = require('morgan');
require('dotenv').config({ path: '../.env' });
const routes = require('./routes/paymentRoutes');
const errorHandler = require('./middlewares/errorHandler');
const bodyParser = require('body-parser');
const app = express();



// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/payments', routes);


// Use raw body for Stripe webhooks
app.use('/api/v1/payments/webhook', bodyParser.raw({ type: 'application/json' }));


// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
