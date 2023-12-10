import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
  try {
    const { nameOrEmail, password } = req.body;

    // Check if the input is an email address
    const isEmail = nameOrEmail.includes('@');

    // Find user by username or email
    let user;
    if (isEmail) {
      user = await User.findOne({ email: nameOrEmail });
    } else {
      user = await User.findOne({ name: nameOrEmail });
    }

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid username/email or password');
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @desc    Register a new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ name }, { email }] });

    if (userExists) {
      res.status(400);
      throw new Error('Username or email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @desc    Get user profile
// @route   POST /api/users/logout
const logoutUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '2s' });
    res.status(200).json({ message: 'Logged out successfully', token });
  }
  catch(error){
    console.error(error);
  }
})

// @desc    Get all users
// @route   GET /api/users/usernames
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, 'name'); 
    const usernames = users.map((user) => user.name);
    res.status(200).json(usernames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  logoutUser,
  getUsers,
};
