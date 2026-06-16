const User = require('../models/User');
const { signAccess, signRefresh } = require('../services/tokens');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, accountType, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create({ email, password, name, accountType, role });

    const accessToken = signAccess(user);
    const refreshToken = signRefresh();

    // store hashed refresh token
    const hashed = await bcrypt.hash(refreshToken, 10);
    await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: hashed } });

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = signAccess(user);
    const refreshToken = signRefresh();

    const hashed = await bcrypt.hash(refreshToken, 10);
    await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: hashed } });

    // toJSON strips password
    res.json({ user: user.toJSON(), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // find user whose refreshTokens array contains a hash matching this token
    const users = await User.find({}).select('+refreshTokens');
    let matchedUser = null;
    let matchedHash = null;

    for (const u of users) {
      if (!u.refreshTokens || u.refreshTokens.length === 0) continue;
      for (const hash of u.refreshTokens) {
        const valid = await bcrypt.compare(refreshToken, hash);
        if (valid) {
          matchedUser = u;
          matchedHash = hash;
          break;
        }
      }
      if (matchedUser) break;
    }

    if (!matchedUser) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // rotate: remove old token, add new one
    const newRefresh = signRefresh();
    const newHash = await bcrypt.hash(newRefresh, 10);

    await User.findByIdAndUpdate(matchedUser._id, {
      $pull: { refreshTokens: matchedHash },
      $push: { refreshTokens: newHash },
    });

    const accessToken = signAccess(matchedUser);
    res.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // clear all refresh tokens for this user
    await User.findByIdAndUpdate(req.user.userId, { refreshTokens: [] });
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
