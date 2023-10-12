const { body } = require('express-validator');

exports.arrayValidatorRules = [
  body('genre', 'Genre should be a valid array of strings')
    .isArray({ min: 1 })
    .custom((value) => {
      if (!Array.isArray(value)) {
        throw new Error('Genre should be an array');
      }

      if (value.some((item) => typeof item !== 'string')) {
        throw new Error('Each element in the genre array should be a string');
      }

      return true;
    })
];
