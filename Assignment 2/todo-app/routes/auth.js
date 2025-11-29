const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// POST Register
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Validation
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    return res.render('register', {
      title: 'Register',
      errors,
      name,
      email
    });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      errors.push({ msg: 'Email is already registered' });
      return res.render('register', {
        title: 'Register',
        errors,
        name,
        email
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();
    
    // Redirect to login with success message
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// POST Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/tasks',
  failureRedirect: '/auth/login'
}));

// GitHub authentication (only if enabled)
router.get('/github', (req, res, next) => {
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  } else {
    res.redirect('/auth/login?error=github_disabled');
  }
});

router.get('/github/callback', (req, res, next) => {
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.authenticate('github', { failureRedirect: '/auth/login' })(req, res, next);
  } else {
    res.redirect('/auth/login');
  }
}, (req, res) => {
  res.redirect('/tasks');
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;