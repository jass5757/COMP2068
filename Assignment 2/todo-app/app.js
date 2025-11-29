// Load environment variables FIRST
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

// Import database configuration
require('./config/database');

// Import passport configuration
require('./config/passport')(passport);

// Import routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const tasksRouter = require('./routes/tasks');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layouts/main' });

// Register partials
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Register Handlebars helpers
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

hbs.registerHelper('formatDate', function(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

hbs.registerHelper('isOverdue', function(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
});

hbs.registerHelper('isDueToday', function(dueDate) {
  if (!dueDate) return false;
  return new Date(dueDate).toDateString() === new Date().toDateString();
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
};

// Only use MongoDB store if MONGODB_URI is provided
if (process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  });
  console.log('✅ Using MongoDB session store');
} else {
  console.log('⚠️  Using memory session store (not for production!)');
}

app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables for views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;