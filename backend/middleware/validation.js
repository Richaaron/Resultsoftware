const Joi = require('joi');

/**
 * Request validation middleware factory
 * Validates request body, params, and query against schemas
 */
const validate = (schema) => {
  return (req, res, next) => {
    // If body is empty or a string, try to normalize it one last time
    if (!req.body || Object.keys(req.body).length === 0 || typeof req.body === 'string') {
      const rawBody = req.body || req.apiGateway?.event?.body || req.event?.body;
      if (rawBody) {
        try {
          req.body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
        } catch (error) {
          // Ignore parse errors here, let Joi handle it
        }
      }
    }

    const { error, value } = schema.validate(
      {
        body: req.body,
        params: req.params,
        query: req.query
      },
      {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false
      }
    );

    if (error) {
      const err = new Error('Validation Error');
      err.isJoi = true;
      err.details = error.details;
      err.status = 400;
      return next(err);
    }

    // Replace req properties with validated/cleaned data
    if (value.body) req.body = value.body;
    if (value.params) req.params = value.params;
    if (value.query) req.query = value.query;

    next();
  };
};

// Common validation schemas
const schemas = {
  login: Joi.object().keys({
    body: Joi.object({
      username: Joi.string().trim().min(3).max(30).required(),
      password: Joi.string().min(6).required()
    }).unknown(true)
  }),

  createStudent: Joi.object().keys({
    body: Joi.object({
      firstName: Joi.string().max(50).required(),
      lastName: Joi.string().max(50).required(),
      registrationNumber: Joi.string().max(20).required(),
      studentClass: Joi.string().max(10).required(),
      section: Joi.string().valid('Science', 'Art', 'Commercial').optional(),
      parentEmail: Joi.string().email().optional(),
      subjectIds: Joi.array().items(Joi.number()).optional(),
      profileImage: Joi.string().optional()
    })
  }),

  createResult: Joi.object().keys({
    body: Joi.object({
      studentId: Joi.number().required(),
      subjectId: Joi.number().required(),
      term: Joi.string().max(20).required(),
      academicYear: Joi.string().max(9).required(),
      ca1Score: Joi.number().min(0).max(100).required(),
      ca2Score: Joi.number().min(0).max(100).required(),
      examScore: Joi.number().min(0).max(100).required(),
      remark: Joi.string().optional()
    })
  }),

  updateResult: Joi.object().keys({
    body: Joi.object({
      ca1Score: Joi.number().min(0).max(100).optional(),
      ca2Score: Joi.number().min(0).max(100).optional(),
      examScore: Joi.number().min(0).max(100).optional(),
      remark: Joi.string().optional(),
      term: Joi.string().max(20).optional(),
      academicYear: Joi.string().max(9).optional()
    }).min(1)
  }),

  broadsheet: Joi.object().keys({
    query: Joi.object({
      studentClass: Joi.string().max(10).required(),
      term: Joi.string().max(20).required(),
      academicYear: Joi.string().max(9).required()
    })
  })
};

module.exports = { validate, schemas };
