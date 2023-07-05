import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';


mongoose
  .connect('mongodb+srv://admin:wwwwww123@cluster0.jvbl935.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('DB OK'))
  .catch((err) => console.log(err));

const PORT = 3000;

const app = express();

app.use(express.json());

app.post('/auth/register', registerValidation, (req, res) => {
  
});

app.listen(PORT, () => {
  console.log('Server OK');
});