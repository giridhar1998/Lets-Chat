import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })

  if (user && (await user.matchPassword(password))) {
      res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      })
  } else {
      res.status(401)
      throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
  
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
  
    if (userExists) {
      res.status(400)
      throw new Error('Username or email already exists')
    }

    const user = await User.create({
      name,
      email,
      password,
    })
    res.status(201).json({ message: 'User registered successfully' });
})

export {
    authUser,
    registerUser,
}