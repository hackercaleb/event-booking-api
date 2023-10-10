const { body } = require('express-validator');

exports.arrayValidatorRules = [body('genre', ' should be a valid array').isArray({ min: 1 })];
