import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
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
}

export const login = async (req, res) => {
  try {
    const { email, password }= req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No current user'});
    }

    const isPasswordValid = await bcrypt.compare(password, user._doc.passwordHash);

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
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'No such user' });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'No access' });
  }
}