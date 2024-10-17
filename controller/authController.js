require("dotenv").config();
const {query} = require("../db")
const jwt = require("jsonwebtoken");



const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    const date = new Date();
    const time = parseInt(date.getTime() / 1000);
    const user = await query('SELECT * FROM users WHERE id = $1', [decodedToken.id]);
    // console.log(user)

    if (user && decodedToken.iat < time) {
      req.user = user.rows[0];
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
module.exports = {isAuthenticated}