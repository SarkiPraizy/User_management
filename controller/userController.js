require("dotenv").config();
const jwt = require("jsonwebtoken");
const {query} = require("../db")
const bcrypt = require('bcrypt')

async function jwtToken(payload) {
  const token = await jwt.sign({ id: payload }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRATION_TIME })
  return token
}

// SIGNUP CONTROLLER ROUTE
const signup = async function (req, res, next) {
    try {
      const { email,username, password, confirmPassword } =
        req.body;
  
     
  
      if (password !== confirmPassword) {
        const error = new Error("password does not match");
        return next(error);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await query( 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
      );
      
      return res.status(201).json({
        message: 'Signup successful',
        user: {
          id: user.rows[0].id,
          username: user.rows[0].username,
          email: user.rows[0].email
        }
      });
      
    } catch (error) {
      next(error);
    }
  };
  
  // SIGIN CONTROLLER ROUTE
  const signin = async function (req, res, next) {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        const error = new Error("Username or password is incorrect");
        return next(error);
      }
      // checking if user exist && password is correct
      const user = await query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (!user || !(await bcrypt.compare(password, user.rows[0].password))) {
  
        const error = new Error("Incorrect email or password");
        return next(error);
      }

      
      const token = await jwtToken(user.rows[0].id);
      res.status(200).json({
        status: "success",
        token,
        user: user.rows[0],
      });
    } catch (error) {
      return next(error, { message: "user login unsuccessful" });
    }
  };

  // UPDATE USER ROUTE
  const updateUser = async function (req, res, next) {
    try {
        
        const { username, email, password } = req.body;
        
        if (!req.user || !req.user.id) {
            return res.status(400).json({ status: 'Error', message: 'User ID is missing' });
        }

        
        const result = await query(
            'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
            [username, email, password, req.user.id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ status: 'Error', message: 'User not found or no changes made' });
        }

        
        return res.status(200).json({
            status: 'OK',
            message: 'Update successful',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error updating user:', error);
        return next(error);
    }
};
//LOGOUT ROUTE
const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
  });

  return res
    .status(200)
    .json({ message: 'You have been successfully logged out' });
};

  module.exports = { 
    signup,
    signin,
    updateUser,
    logout
  }