const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path as per your project structure

async function handleRegistration(req, res) {
  const { name, email, password, confirm_password } = req.body; // Add confirm_password

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'Email already registered');
      return res.redirect('/register');
    }

    // Check if passwords match
    if (password !== confirm_password) {
      req.flash('error_msg', 'Passwords do not match');
      return res.redirect('/register');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Log success and redirect back to the registration page
    console.log('User registered successfully:', newUser);
    req.flash('success_msg', 'Registration successful!');
    res.redirect('/register'); // Redirect back to the same registration page
  } catch (error) {
    console.error('Error during user registration:', error);
    req.flash('error_msg', 'Error during registration. Please try again.');
    res.redirect('/register'); // Redirect back to the registration page on error
  }
}

module.exports = {
  handleRegistration,
};
