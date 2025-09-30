const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, "4e3e9a02b948abad01f0975553c00ff85c34bb3991b406ec06c04fe0c707d61c47fde323a7b446af568f92e2e031dbc6ebf477e00c461541957b46e43528655f", {
      expiresIn: '1d'
    });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};
