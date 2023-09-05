import jwt from "jsonwebtoken";
import asyncHandler from './asyncHandler';
import User from '../models/UserModel';

// protect routes

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password');
      next()
    } catch (error) {
      console.log(error)
      res.status(401);
      throw new Error("Not Authorized. Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized. No token");
  }
}) ;

// Admin middleware

const admin = (req, res, next) => {
  if(req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as admin")
  }
}

export { protect, admin } 