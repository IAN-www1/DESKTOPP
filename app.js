// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

// Adjust path to controllers
const { handleRegistration } = require('./controllers/registerController'); 
const { handleLogin } = require('./controllers/loginController');
const User = require('./models/User');
const Item = require('./models/Item');
const Order = require('./models/Order');
const paypalRoutes = require('./paypal/paypalRoutes');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const topupRouter = require('./routes/topup');
const rfidRouter = require('./routes/rfid'); // Adjust the path if necessary
const rfidPaymentRouter = require('./routes/rfid_payment'); // Adjust path if necessary

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Connection URI from environment variable
const uri = process.env.MONGO_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json()); // For parsing application/json

// Enable CORS for all routes
app.use(cors());

// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set `secure: true` if using HTTPS

}));



// Flash messages middleware
app.use(flash());

// Set up global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
// Prevent caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Routes
app.use('/paypal', paypalRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/', orderRoutes);
app.use(authRoutes);
app.use('/', dashboardRoutes);

// Example route handler in your Express app
app.get('/', (req, res) => {
  res.redirect('/login'); // Redirect to the login page
});

app.get('/login', (req, res) => {
  res.render('login'); // Render login.ejs
});
app.use('/', topupRouter);
app.use('/rfid', rfidRouter);
app.use('/rfid_payment', rfidPaymentRouter);

app.get('/register', async (req, res) => {
  // Debug log to check session status
  console.log('Session User ID:', req.session.userId);

  // Check if the user is logged in
  if (!req.session.userId) {
    req.flash('error_msg', 'Please log in to view this resource');
    console.log('Redirecting to login due to missing session user ID');
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  // Render the order history page if logged in
  console.log('User is logged in, rendering order history');
  res.render('register');
});


app.get('/forgot', (req, res) => {
  res.render('forgot'); // Render forgot.ejs
});

app.get('/reset', (req, res) => {
  res.render('reset'); // Render reset.ejs
});

app.get('/order_history', async (req, res) => {
  // Debug log to check session status
  console.log('Session User ID:', req.session.userId);

  // Check if the user is logged in
  if (!req.session.userId) {
    req.flash('error_msg', 'Please log in to view this resource');
    console.log('Redirecting to login due to missing session user ID');
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  // Render the order history page if logged in
  console.log('User is logged in, rendering order history');
  res.render('order_history');
});

// Billing route
app.get('/billing', async (req, res) => {
  if (!req.session.userId) {
    req.flash('error_msg', 'Please log in to view this resource');
    return res.redirect('/login');
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/login');
    }

    res.render('billing', { cartItems: req.session.cartItems });
  } catch (error) {
    console.error('Error fetching user or billing information:', error);
    req.flash('error_msg', 'An error occurred while fetching billing information');
    res.redirect('/login');
  }
});



// Handle form submission for registration
app.post('/register', handleRegistration);

// Handle form submission for login
app.post('/login', handleLogin);

// Route to fetch items for menu
app.get('/menu', async (req, res) => {
  if (!req.session.userId) {
    req.flash('error_msg', 'Please log in to view this resource');
    return res.redirect('/login');
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/login');
    }

    const items = await Item.find(); // Fetch all items from MongoDB
    res.render('menu', { items }); // Pass items to menu.ejs
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).send('Server Error');
  }
});
// Route to fetch items
app.get('/items', async (req, res) => {
  if (!req.session.userId) {
    req.flash('error_msg', 'Please log in to view this resource');
    return res.redirect('/login');
  }

  try {
    // Fetch the user from the database
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/login');
    }

    // Fetch all items from MongoDB
    const items = await Item.find(); 
    res.render('items', { items }); // Pass items to items.ejs
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).send('Server Error');
  }
});


// Use the items routes for CRUD operations
app.use('/items', require('./routes/items'));

// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
