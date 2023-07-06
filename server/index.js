import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww123@cluster0.jvbl935.mongodb.net/blog-ts?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log(err));

const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'No current user'});
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isPasswordValid) {
      return res.status(404).json({ message: 'Invalid login or password'});
    }

    const token = jwt.sign({ _id: user._id, }, 'secretKey123', { expiresIn: '30d' });
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Authorization failed'});
  }
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const { email, fullName, avatarUrl, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email,
      fullName,
      passwordHash: hash,
      avatarUrl,
    });

    const user = await doc.save();
    const token = jwt.sign({ _id: user._id, }, 'secretKey123', { expiresIn: '30d' });
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Registration failed'});
  }
});

app.get('/auth/me', checkAuth, (req, res) => {
  try {

  } catch (e) {

  }
});

app.listen(PORT, () => {
  console.log('Server OK');
});
