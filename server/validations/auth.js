import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Password must be greater than 5 letters').isLength({ min: 5 }),
  body('fullName').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Password must be greater than 5 letters').isLength({ min: 5 }),
];