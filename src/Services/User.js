const User = require('../Model/User'); 
const crypto = require('crypto');
const Auth = require('../Auth/auth'); // Adjust the path as necessary

const UserService = {

  async createUser(userData) {
    const { Firstname,Lastname, email, contact, password } = userData;
  
    // Check for required fields
    if ( !Firstname ||!Lastname || !email || !contact || !password ) {
      
      return { success: false, statusCode: 400, error: 'Missing required fields' };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, statusCode: 409, error: 'Email already exists' }; 
    }
  
    const { salt, hash } = this.hashPassword(password);
  
    const user = new User({
      Firstname,
      Lastname,
      email,
      contact,
      password: hash,
      salt
    });
  
    try {
      await user.save();
      return { success: true, statusCode: 201, message: 'User registered successfully!' };
    } catch (error) {
      return { success: false, statusCode: 400, error: error.message };
    }
  },

  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
  },

  async userLogin(loginData) {
    const { email, password } = loginData;

    if (!email || !password) {
      return { success: false, statusCode: 400, error: 'Email and password are required' };
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return { success: false, statusCode: 404, error: 'User not found' }; 
      }

      const isValid = this.validatePassword(password, user.password, user.salt);
      if (!isValid) {
        return { success: false, statusCode: 401, error: 'Invalid password' }; 
      }

      const token = Auth.createToken(user._id, user.email, user.role);

      return { success: true, statusCode: 200, user: { id: user._id, name: user.name, email: user.email }, token }; 
    } catch (error) {
      return { success: false, statusCode: 500, error: 'Internal server error' }; 
    }
  },

  validatePassword(password, hash, salt) {
    if (!hash || !salt) {
      return false; 
    }

    const hashToCompare = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hashToCompare === hash; 
  },


  async addFavoriteItem({ userId, idMeal }) {
    try {
      if (!idMeal) {
        return { success: false, statusCode: 400, message: 'Item ID is required.' };
      }

      const user = await User.findById(userId);
      if (!user) {
        return { success: false, statusCode: 404, message: 'User not found' };
      }

      if (user.Favitem.includes(idMeal)) {
        return { success: false, statusCode: 400, message: 'Item already in favorites' };
      }
  
      user.Favitem.push(idMeal);
      await user.save();
  
      return { success: true, statusCode: 200, message: 'Item added to favorites', favorites: user.Favitem };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Internal server error' };
    }
  },

  async removeFavoriteItem({ userId, idMeal }) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { success: false, statusCode: 404, message: 'User not found' };
      }
  
      if (!user.Favitem.includes(idMeal)) {
        return { success: false, statusCode: 400, message: 'Item not in favorites' };
      }
  
      user.Favitem = user.Favitem.filter(item => item !== idMeal);
      await user.save();
  
      return { success: true, statusCode: 200, message: 'Item removed from favorites', favorites: user.Favitem };
    } catch (error) {
      return { success: false, statusCode: 500, message: 'Internal server error' };
    }
  }
  
  
};

module.exports = UserService;




