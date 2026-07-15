const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
      });
    }
    next(error);
  }
};

module.exports = validateRequest;
