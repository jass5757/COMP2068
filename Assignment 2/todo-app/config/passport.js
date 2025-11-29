const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
          return done(null, false, { message: 'Email not registered' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } catch (err) {
        return done(err);
      }
    }
  ));

  // GitHub Strategy (only if credentials are provided)
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ githubId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            // Create new user
            user = new User({
              githubId: profile.id,
              name: profile.displayName || profile.username,
              email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`,
              avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
            });

            await user.save();
            return done(null, user);
          }
        } catch (err) {
          return done(err);
        }
      }
    ));
    console.log('✅ GitHub OAuth enabled');
  } else {
    console.log('⚠️  GitHub OAuth disabled (no credentials found)');
  }

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};