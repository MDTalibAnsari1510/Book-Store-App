import { SECRET } from './config.js';
import jwt from 'jsonwebtoken';
const { verify } = jwt;

//verifeing JWT token.
export const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"] || req.headers["Authorization"]
  token = token?.replace("Bearer ", "");
  if (!token)
    return res.status(403).json({ success: false, message: "No token provided." });

  const secret = SECRET;
  verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false, message: 'Unauthorized access.'
      });
    } else {
      console.log('-----====', decoded)
      req.userInfo = decoded;
      next()
    }
  });
}

//verifeing for Admin.
export const adminAccess = (req, res, next) => {
  try {
    const { userType } = req.userInfo;
    if (userType === 'admin') {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to perform this action.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err
    });
  }
}

//verifeing for Author or Admin.
export const adminOrAuthorAcess = (req, res, next) => {
  try {
    const { userType } = req.userInfo;
    if (userType === 'admin' || userType === 'author') {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to perform this action.'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err
    });
  }
}