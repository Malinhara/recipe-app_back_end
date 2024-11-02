const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const connectDB = require('./src/DBconnection/Connection');
const userRouter = require('./src/Routers/User');
const itemRouter = require('./src/Routers/Item');

// Load environment variables
dotenv.config();

// Create an express app
const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors({
  origin: 'https://recipe-app-front-end.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet()); 

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], 
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

// Routes
app.use('/user', userRouter);
app.use('/item', itemRouter);
app.use('/admin', userRouter);

// Start the HTTP server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
