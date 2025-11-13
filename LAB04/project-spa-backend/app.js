const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

// Import configurations
const configs = require('./config/globals');

// Import routers
const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');

const app = express();

// Database connection
mongoose.connect(configs.ConnectionStrings.MongoDB)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// CORS configuration
const corsOptions = {
    origin: configs.ClientServer,
    credentials: true
};
app.use(cors(corsOptions));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', indexRouter);
app.use('/projects', projectsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;