//create server
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())
//connect db
const name = process.env.NAME;
const password = process.env.PASSWORD;
const database = process.env.DB_NAME;

const mongoose = require("mongoose");
const UserModel = require('./models/Users');

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://${name}:${password}@cluster0.moa2f.mongodb.net/${database}?retryWrites=true&w=majority`
).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));
//set port
const PORT = process.env.PORT;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.json({ message: "hi in eleanor back end" });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create acc
app.post('/CreateUser', async (req, res) => {
  try {
    const { username, password, name, email } = req.body; // Get data from the request body

    // Check if username already exists
    const findUser = await UserModel.findOne({ username: username }); // Query database for the username

    if (findUser) {
      return res.status(400).json({ message: 'Username already exists' }); // Send error if username is taken
    }

    // If username doesn't exist, create a new user
    const newUser = new UserModel({ username, password, name, email });
    await newUser.save(); // Save the new user in the database

    res.status(201).send({ message: 'Registered successfully!' }); // Success response
  } catch (err) {
    res.status(500).send({ message: 'Error registering', error: err.message }); // Handle error with status and message
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// log in
app.post('/login', async (req, res) => {
  try {
    const { name, pass } = req.body;
    const findUser = await UserModel.findOne({ username: name }); // Use findOne to check for existence

    if (!findUser) {
      return res.status(400).json({ message: 'Wrong username or password' }); // Updated error message
    }
    if (pass === findUser.password) {
      res.status(200).json(findUser._id);
    } else {
      return res.status(400).send({ message: 'Wrong username or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error login'}); // Corrected spelling and message
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get users 
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find(); // Handle async with await
    res.json(users);
  } catch (err) {
    res.status(404).json({ message: "Error fetching users", error: err });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/getPass', async (req, res) => {
  try {
    const { name } = req.body; // Get username from request body
    const findUser = await UserModel.findOne({ username: name }); // Find user by username

    if (!findUser) {
      return res.status(400).json({ success: false, message: 'Username does not exist' }); // Return error with success: false
    }

    res.status(200).json({ success: true, password: findUser.password }); // Return success with password
  } catch (err) {
    console.error('Error fetching password:', err); // Log the error for debugging
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message }); // Return error with success: false
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//delete user
app.delete("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
});
// Start the server only after the DB connection is successful
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
