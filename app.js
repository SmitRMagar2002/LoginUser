// const express = require('express');
// const connectDB = require('./config/db');
// const bcrypt = require('bcrypt');
// const User = require('./models/user.model');
// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Sample route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Auth Service');
// });

// // signup route
// app.post('/signup', async (req, res) => {
//     const {name, email, password} = req.body;
    
//     const user = await User.findOne({ email });
//     // Check if user already exists
//     if(user) {
//         return res.status(400).send('User already exists');
//     }
//     const salt = await bcrypt.genSalt(10); // generate salt means
     
//     //  to add random data to the password before hashing
//     const hashedpassword = await bcrypt.hash(password, salt);
    
//     // Create a new user
//     const  newUser = new User({
//         username: name,
//         email,
//         password: hashedpassword
//     });

//     // Here you would typically add code to save the user to the database
//     await newUser.save();


//     res.status(201).send(`User ${name} signed up successfully!`);
// })

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
// connectDB();
//   console.log(`Auth Service is running on port ${PORT}`);
// });

// module.exports = app;

const express = require('express');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const User = require('./models/user.model');

const app = express();

// Middleware
app.use(express.json());

// Connect DB FIRST
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Auth Service');
});

// SIGNUP ROUTE
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

module.exports = app;
