const { Router } = require('express');
const Secret = require('../models/Secret');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

module.exports = Router()
  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const secrets = await Secret.getSecrets();
      res.json(secrets);
    } catch (e) {
      next(e);
    }
  });
