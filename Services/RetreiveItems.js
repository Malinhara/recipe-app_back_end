const axios = require('axios');
const User = require('../Model/User');

const RetreiveItems = {
  async getCategories() {
    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
      return {
        statusCode: response.status,
        categories: response.data.categories.slice(0, 5).map(category => ({
          id: category.idCategory, 
          name: category.strCategory 
        })),
      };
    } catch (error) {
      return {
        statusCode: error.response ? error.response.status : 500,
        error: 'Error fetching categories: ' + error.message,
      };
    }
  },

  async getRecipesByCategoryName(categoryName) {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
      return {
        statusCode: response.status,
        recipes: response.data.meals || [],
      };
    } catch (error) {
      return {
        statusCode: error.response ? error.response.status : 500,
        error: 'Error fetching recipes: ' + error.message,
      };
    }
  },



  async getMealdetailsById(idMeal) {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
  
   
      if (response.data && response.data.meals && response.data.meals.length > 0) {
        return {
          statusCode: 200,
          success: true,
          meal: response.data.meals[0],
        };

      } else {
        return {
          statusCode: 404,
          success: false,
          error: 'Meal not found',
        };
      } 
  
    } catch (error) {
      console.error('Error fetching meal details:', error);
      return {
        statusCode: error.response ? error.response.status : 500,
        success: false,
        error: error.message || 'An error occurred while fetching meal details.',
      };
    }
  },
  
  async getMealById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.Favitem || user.Favitem.length === 0) {
        return {
          statusCode: 404,
          success: false,
          message: 'User or favorite items not found',
        };
      }
  
    
      const mealDetails = await Promise.all(
        user.Favitem.map(async (mealId) => {
          const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
          return response.data.meals ? response.data.meals[0] : null; 
        })
      );
  
      return {
        statusCode: 200,
        success: true,
        recipes: mealDetails.filter(Boolean),
      };
    } catch (error) {
      console.error('Error fetching meal details:', error);
      return {
        statusCode: error.response ? error.response.status : 500,
        success: false,
        error: error.message || 'An error occurred while fetching meal details.',
      };
    }
  }
}

module.exports = RetreiveItems;
