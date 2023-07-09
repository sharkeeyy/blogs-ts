import { body } from 'express-validator';

export const postCreateValidation = [
  body('title', 'Enter post header').isLength({ min: 3 }).isString(),
  body('text', 'Enter post text').isLength({ min: 10 }).isString(),
  body('tags', 'Wrong tags format').optional().isString(),
  body('imageURL', 'Wrong image URL').optional().isString(),
];