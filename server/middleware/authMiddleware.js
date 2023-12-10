import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.hasOwnProperty('id')) {
        res.status(401);
        throw new Error('Invalid token payload or missing user ID');
      }

      req.userId = decoded.id; 
      req.user = await User.findById(req.userId).select('-password');

      if (!req.user) {
        res.status(404);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, please provide a valid token' });
  }
});

export { protect };
