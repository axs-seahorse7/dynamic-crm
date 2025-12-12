
import userModel from '../db/schemas/user.schema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



async function userRegister(req, res, next) {
  try {
    const { name, email, phone, password, businessEmail, businessContact, country, state } = req.body;


    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      businessEmail,
      businessContact,
      country,
      state,
    });

    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      token,
      success: true,
    });

  } catch (error) {
    console.error('userRegister error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default userRegister;