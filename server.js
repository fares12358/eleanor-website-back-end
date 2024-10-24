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
    const { username, password } = req.body; // Get from request body

    // Check if username already exists
    const findUser = await UserModel.findOne({ username: username }); // Use findOne to check for existence

    if (findUser) {
      return res.status(400).json({ message: 'Username already exists' }); // Updated error message
    }

    const newUser = new UserModel({ username, password });
    await newUser.save();

    res.status(201).send('Registered successfully!'); // Corrected spelling and message
  } catch (err) {
    res.status(500).send({ message: 'Error registering', error: err }); // Corrected spelling and message
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// log in
app.post('/login', async (req, res) => {
  try {
    const { name, pass } = req.body;
    const findUser = await UserModel.findOne({ username: name }); // Use findOne to check for existence

    if (!findUser) {
      return res.status(400).send({ message: 'Username not exists' }); // Updated error message
    }
    if (pass === findUser.password) {
      res.status(200).json(findUser._id);
    } else {
      return res.status(400).json({ message: 'Wrong email or password' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Error login', error: err }); // Corrected spelling and message
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
    const { name } = req.body;
    const findUser = await UserModel.findOne({ username: name });

    if (!findUser) {
      return res.status(400).send({ message: 'Username does not exist' });
    }
    res.status(200).json(findUser.password);
  } catch (err) {
    res.status(500).send({ message: 'Internal server error', error: err });
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
