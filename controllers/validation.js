const joi = require('joi');

const registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().alphanum().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(15).required(),
  });
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    console.error('Validation error:', error.details);
    return { error };
  }

  return { value };
};

const expenseValidation = (data) => {
  const schema = joi.object({
    title: joi
      .string()
      .regex(/^[a-zA-Z]+$/)
      .required()
      .messages({
        'string.empty': 'Title is required.',
        'string.pattern.base': 'Title must contain only letters.',
      }),
    amount: joi.number().precision(2).required().messages({
      'number.base': 'Amount must be a number.',
      'number.empty': 'Amount is required.',
      'any.required': 'Amount is required.',
    }),
    category: joi
      .string()
      .regex(/^[a-zA-Z]+$/)
      .required()
      .messages({
        'string.empty': 'Category is required.',
        'string.pattern.base': 'Category must contain only letters.',
      }),
    expense_date: joi.date().iso().required().messages({
      'date.base': 'Expense date must be a valid date.',
      'date.format': 'Invalid date format. Use YYYY-MM-DD.',
      'any.required': 'Expense date is required.',
    }),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    console.error('Validation error:', error.details);
    return { error };
  }

  return { value };
};

module.exports = { registerValidation, expenseValidation };
