const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ msg: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 8);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verificationToken
    });

    await user.save();

    const verificationUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: false
    });

    const mailOptions = {
      from: '"BugTracker Pro 🐞" <no-reply@bugtrackerpro.com>',
      to: email,
      subject: 'Verify Your Email ✅',
      html: `
        <h2>Welcome to BugTracker Pro</h2>
        <p>Please verify your email to activate your account:</p>
        <a href="${verificationUrl}" style="padding:10px 20px; background:#6366f1; color:#fff; text-decoration:none;">Verify Email</a>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: 'Registration successful. Please check your email to verify your account.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      msg: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(401).json({ msg: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ msg: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ 
      msg: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

module.exports = { register, login, verifyEmail };
