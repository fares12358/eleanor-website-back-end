//create server
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());



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
    res.status(500).json({ message: 'Error login' }); // Corrected spelling and message
  }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Get users 
app.get("/Getuser", async (req, res) => {
  try {
    const { id } = req.query;
    const findUser = await UserModel.findOne({ _id: id });
    if (!findUser) {
      return res.status(400).json({ message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      name: findUser.name,
      email: findUser.email,
      username: findUser.username,
      id: findUser.id,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user data", error: err });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // forGet pass
app.post('/getPass', async (req, res) => {
  try {
    const { name } = req.body; // Get username from request body
    const findUser = await UserModel.findOne({ username: name }); // Find user by username

    if (!findUser) {
      return res.status(400).json({ success: false, message: 'Username does not exist' }); // Return error with success: false
    }

    res.status(200).json({ success: true, password: findUser.password }); // Return success with password
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message }); // Return error with success: false
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/getCat', async (req, res) => {
  try {
    const { id } = req.body; // Get username from request body
    const findUser = await UserModel.findOne({ _id: id }); // Find user by username

    if (!findUser) {
      return res.status(400).json({ success: false, message: 'Username does not exist' }); // Return error with success: false
    }
    const categoryKeys = Object.keys(findUser.category);
    res.status(200).json({ success: true, cat: categoryKeys }); // Return success with password
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message }); // Return error with success: false
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/getItems', async (req, res) => {
  try {
    const { id, catKey } = req.body; // Get user ID and category key from request body
    const findUser = await UserModel.findOne({ _id: id }); // Find user by ID

    if (!findUser) {
      return res.status(400).json({ success: false, message: 'User does not exist' }); // Return error if user not found
    }

    // Dynamically access the category using the catKey
    const items = findUser.category[catKey];

    if (!items) {
      return res.status(404).json({ success: false, message: 'No items found for this category' }); // Return error if category does not exist
    }

    // If items exist, return them
    res.status(200).json({ success: true, items }); // Return success with items
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message }); // Return error with success: false
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/addCategory', async (req, res) => {
  try {
    const { id, catName } = req.body;

    // Check for missing fields
    if (!id || !catName) {
      return res.status(400).json({ success: false, message: "ID and category name are required" });
    }

    // Find user by ID
    const userExists = await UserModel.findById(id);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if category already exists
    if (userExists.category && userExists.category[catName]) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    // Update category with new empty array for the category name
    const updateObject = {
      $set: { [`category.${catName}`]: [] }
    };

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateObject, { new: true });

    res.status(200).json({ success: true, message: "Category added successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use('/uploads', express.static('uploads'));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require('dotenv').config();
const multer = require("multer");
const path = require("path");
const admin = require("firebase-admin");
const sharp = require("sharp");
// Define the service account object directly in the code
const serviceAccount = {
  type: "service_account",
  project_id: "eleanor-3aa19",
  private_key_id: "4d2fcc9219ea9396dca3d327190d0347d716a4a9",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDfBl0le6O1RRB/\nde61Ioq1m5yh9dGJuJVuBKUfWdbLnkGaIJNkYNnaDLJZr7yX9dOELM2b5Mczkids\n+kVe1SOh/vZOCsPJpOGrkh1vJxfi1N2zWOTJKz/5I9foa9MRFjAM8AAe2HQPz+Tf\nFN3J2xxravPOnNxLFNouWjvEKRFb21jkQm6p+gle2/Ej283kUbohACa7J2mo5OOr\nOy/GEXDRg3w78Gocya23ZjwcTQxpesvu3wDGGjH8VBKMauPOlXtFVGoLXcBJ5zkI\nLvE0srAN/jVH4MDazrKoAQ6Ee2QmWohsbLkyEl4bN0+vc+xcNsLbUX/e5jp8HTWM\nuv2+C7VnAgMBAAECggEAEjSCcqaBZNugDszWpnc3sWlkGMhodACFmiHLmh/gQRDI\nXsdyoJ/98yb+1q6vYLbSru26qZNm5gEeh251LoTher4a5vXz/h11Gmc7+zB1alu2\nmTGUGLkXaMPnQklYRQMgUFNgVHmWHRr683F67+5F3J2HYgHl7Zm50aIl/MuJZ4un\ne/7EtcS1A1DtGll2fBgVe3aIWWTdM/cFuUbm+6aSI/UGZMGTxYhjJXVZtAChO0gw\n10HZVg/j73DclkE1W2lzjBklNWzpKZfG27FbRLEAwD487HNpF2YgS7T97OMtA+Xl\nGw10CFKYKa31KlXNRI7i5GPlscBcJMqN7d+g152U0QKBgQD3M3Kw2j3+UIST7yTc\ntT5XG0v+cPoAR1ZmywCKSqKVWVVwvOmjUWmwEWvVF9q9yaHkLKuawEvOmXf6u0pR\nooym/cs4zfz3KV8frf7Z5Jdil9poVwhICxyWoOYhAHa/ex9nYUJjB8NfJZ0nfXXG\n13ZVh91fNBJ9IPqTARPdpf7Y7wKBgQDm9p4ZgUA5kYbETQuB0XaPNnMiLxkb8kla\nvffMdM2BZmLsESPxH58Pofdxl5BhOkg04H2rq26eHk+4uf3tfptXrLZ6mosDGfJc\nJjFaYpzqmbYg3+vf3Wc/2JgEstBgQDgQ96V1nZ8QPMEmJ80yDg1CFcvrLxdo0tjf\nzzH6T1k7CQKBgQC1722X7+f0hnotDrMIpXQuU+7IY4n8LoTOvtW08l1aohcaFE+4\nXbD1Xr0IZrgdOosmDiJ2kNS6R4VgSfvWvVXbiarKMgDeP9q8zChnYbBxZeXfKT71\nFwiBbAYzf83l+84PHivoCsyl+F8Ds3i9UdLL/GTXLtH0uhLxordmSEeajQKBgQCu\nxw2ZC2BIsEGlpxAAKzxm37N8uNttdIniK0Or6u/g7lQJhGcIfv9lWxHfWeyeRvaB\nXSh8knxhF1sI1Wa9JEP1svNcEDsGG8p1xUkvttQ8DBnxAsKCZA9QF13ioFZjn/VN\nkboaKS9HoFIhx5jWOh/6VHg9/yLd5kDMDQUrAITr0QKBgQCm7VvyUwyxTIS94BGb\n+GIyTf7jwttSnk3sJs4B0+FuE3u9jUGsWj+QrzL5iAUn0yUkgu6jIYApJFGfyzzu\nx84LYQlZFth4NP7MRuOPDrrPz9uc9JtWN12zQmnH1OOc9jyMI8Boca0jvvTNVMu2\nBT0sEc2yupuPfeEAiI8dXpTJLw==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-r3ape@eleanor-3aa19.iam.gserviceaccount.com",
  client_id: "104995025050434361561",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r3ape%40eleanor-3aa19.iam.gserviceaccount.com",
};

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "eleanor-3aa19.appspot.com",
});


const bucket = admin.storage().bucket();

// Initialize multer memory storage (to store files in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Add image to a specific user by ID
app.post("/uploadImage/:id/:catKey", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const catKey = req.params.catKey;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const convertedBuffer = await sharp(req.file.buffer).webp().toBuffer();
     const fileName = `images/${Date.now()}_${path.parse(req.file.originalname).name}.webp`;
    const file = bucket.file(fileName);

    // Create a stream to upload the file to Firebase Storage
    const blobStream = file.createWriteStream({
      metadata: {
        contentType: 'image/webp',
      },
    });

    blobStream.on("error", (error) => {
      res.status(500).json({ message: "Upload failed", error: error.message });
    });

    blobStream.on("finish", async () => {
      await file.makePublic(); // Make the file public
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      // Update the user's category with the new image URL
      const update = { $push: { [`category.${catKey}`]: publicUrl } };
      const updatedUser = await UserModel.findByIdAndUpdate(userId, update, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "Image uploaded successfully", user: updatedUser });
    });

    blobStream.end(req.file.buffer); // End the stream with the file buffer
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Start the server only after the DB connection is successful
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});





