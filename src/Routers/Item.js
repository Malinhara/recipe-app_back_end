const express = require('express');
const RetreiveService = require('../src/Services/RetreiveItems');
const Auth = require('../src/Auth/auth');

const itemRouter = express.Router();

// Route to get categories
itemRouter.get('/categories', async (req, res) => {
  const response = await RetreiveService.getCategories();
  res.status(response.statusCode).json(response);
});


itemRouter.get('/categories/:name', async (req, res) => {
  const categoryName = req.params.name; 
  const response = await RetreiveService.getRecipesByCategoryName(categoryName);
  res.status(response.statusCode).json(response);
});


itemRouter.get('/favmeal/ids', Auth.authenticate, async (req, res) => {
  const userId = req.userId;
  try {
    const response = await RetreiveService.getMealById(userId);
    res.status(response.statusCode).json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

itemRouter.get('/details/:id', Auth.authenticate, async (req, res) => {
  const mealId = req.params.id;

  try {
    const mealDetails = await RetreiveService.getMealdetailsById(mealId);

    res.status(mealDetails.statusCode).json(mealDetails);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});




module.exports = itemRouter;
