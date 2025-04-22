import User from '../models/UserModel.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import asyncHandler from 'express-async-handler';

// Register User
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  
  // Check if user already exists
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }

  // Create user
  const user = await User.create({ name, email, password, role: role || 'jobseeker' });
  
  // Generate token
  const token = user.createJWT();
  
  res.status(StatusCodes.CREATED).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      bio: user.bio,
      company: user.company,
      position: user.position
    },
    token
  });
});

// Login User
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  
  // Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }
  
  // Generate token
  const token = user.createJWT();
  
  // Remove password from response
  user.password = undefined;
  
  res.status(StatusCodes.OK).json({
    success: true,
    user,
    token
  });
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  
  res.status(StatusCodes.OK).json({
    success: true,
    user
  });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, location, bio, company, position } = req.body;
  
  if (!name || !email) {
    throw new BadRequestError('Please provide all required values');
  }
  
  const user = await User.findOne({ _id: req.user.userId });
  
  user.name = name;
  user.email = email;
  user.location = location;
  user.bio = bio;
  user.company = company;
  user.position = position;
  
  await user.save();
  
  // Generate new token with updated info
  const token = user.createJWT();
  
  res.status(StatusCodes.OK).json({
    success: true,
    user,
    token
  });
});

export { register, login, getCurrentUser, updateUser }; 