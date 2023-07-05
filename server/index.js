import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww123@cluster0.jvbl935.mongodb.net/blog-ts?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log(err));

const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { email, fullName, avatarUrl, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email,
      fullName,
      passwordHash,
      avatarUrl,
    });

    const user = await doc.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log('Server OK');
});
