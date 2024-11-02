const express = require('express');
const UserService = require('../src/Services/User');
const Auth = require('../src/Auth/auth');
const authorizeAdmin = require('../src/Middleware/Authadmin');

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
  const response = await UserService.createUser(req.body);
  res.status(response.statusCode).json(response);
});

userRouter.post('/login',async (req, res) => {
    const response = await UserService.userLogin(req.body);
    res.status(response.statusCode).json(response);
  });

  userRouter.get('/verify', Auth.authenticate, (req, res) => {
    res.json({
      success: true,
      message: 'Token is valid',
      userId: req.userId,
      userEmail: req.userEmail
    });
  });


  userRouter.get('/dashboard', Auth.authenticate, async (req, res) => {
    try {
      const userRole = req.userRole; // Ensure `req.userRole` is set correctly in `Auth.authenticate`
      const response = await authorizeAdmin(userRole);
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  userRouter.post('/favitems', Auth.authenticate, async (req, res) => {
    try {
      const userId = req.userId; 
      const { idMeal } = req.body;
  
      if (!idMeal) {
        return res.status(400).json({ success: false, message: 'Item ID is required.' });
      }
  
      const response = await UserService.addFavoriteItem({ userId, idMeal }); 
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }),

  userRouter.delete('/favitems', Auth.authenticate, async (req, res) => {
    try {
      const userId = req.userId; 
      const { idMeal } = req.body; 
  
      if (!idMeal) {
        return res.status(400).json({ success: false, message: 'Item ID is required.' });
      }
  
      const response = await UserService.removeFavoriteItem({ userId, idMeal });
      res.status(response.statusCode).json(response);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  

module.exports = userRouter;
