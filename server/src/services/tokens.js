const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

function signAccess(user) {
  return jwt.sign(
    { userId: user._id, role: user.role, plan: user.plan },
    env.jwtSecret,
    { expiresIn: '15m' }
  );
}

function signRefresh() {
  return crypto.randomBytes(40).toString('hex');
}

function verifyAccess(token) {
  return jwt.verify(token, env.jwtSecret);
}

module.exports = { signAccess, signRefresh, verifyAccess };
