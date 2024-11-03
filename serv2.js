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
      const items = findUser.category[catKey]?.[1];
  
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
      const { id, catName,selectedOption} = req.body;
  
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
        $set: { [`category.${catName}`]: [selectedOption,[]] }
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
  require('dotenv').config();
  const multer = require("multer");
  const path = require("path");
  const admin = require("firebase-admin");
  const sharp = require("sharp");
  const { log } = require("console");
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
        const update = { $push: { [`category.${catKey}.1`]: publicUrl } };
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
  app.post('/deleteItem', async (req, res) => {
    try {
      const { id, catName, url } = req.body;
  
      // Validate that required fields are present
      if (!id || !catName || !url) {
        return res.status(400).json({ success: false, message: "ID, category name, and URL are required." });
      }
  
      // Remove the URL from the MongoDB document
      const result = await UserModel.updateOne(
        { _id: id, [`category.${catName}.1`]: url },
        { $pull: { [`category.${catName}.1`]: url } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: "User, category, or URL not found" });
      }
  
      // Extract the file name from the URL correctly
      const fileName = url.split('/').pop().split('?')[0]; // Just the file name
  
      // The correct path should match how you uploaded the file
      const filePath = `images/${fileName}`; // Use the same path as during upload
  
      // Attempt to delete the file from Firebase Storage
      const file = bucket.file(filePath);
      const deleteResponse = await file.delete();
      
      // Optionally check if the file was deleted successfully, but in Firebase Storage, errors will be thrown if not found
      if (deleteResponse[0] && deleteResponse[0].code === 'NOT_FOUND') {
        console.warn(`File not found in Firebase Storage: ${filePath}`);
      }
  
      res.status(200).json({ success: true, message: "Item deleted successfully from both MongoDB and Firebase Storage" });
    } catch (error) {
      console.error("Error deleting item from Firebase:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  });
  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.post('/AddUsedItem', async (req, res) => {
    try {
      const { id, topUrl, btmUrl, dateUse } = req.body;
  
      // Find the user by ID
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Create a new used item array
      const newItem = [topUrl, btmUrl, dateUse];
      user.Used = user.Used || []; // Ensure 'Used' exists
      user.Used.push(newItem); // Add the new item to the Used array
  
      // Check if categories exist and update accordingly
      if (user.category && typeof user.category === 'object') {
        for (const key in user.category) {
          if (Array.isArray(user.category[key])) {
            // Remove topUrl if it exists in the category array
            const topUrlIndex = user.category[key].indexOf(topUrl);
            if (topUrlIndex > -1) {
              await UserModel.updateOne(
                { _id: id },
                { $pull: { [`category.${key}`]: topUrl } } // Correctly use $pull with the value
              );
            }
            // Remove btmUrl if it exists in the category array
            const btmUrlIndex = user.category[key].indexOf(btmUrl);
            if (btmUrlIndex > -1) {
              await UserModel.updateOne(
                { _id: id },
                { $pull: { [`category.${key}`]: btmUrl } } // Correctly use $pull with the value
              );
            }
          }
        }
      }
  
      // Save the updated user document
      await user.save();
  
      // Respond with a success message
      res.status(200).json({ success: true, message: "Item added successfully" });
    } catch (error) {
      console.error("Error adding item to favorites:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.post('/GetUsedItem', async (req, res) => {
    try {
      const { id } = req.body; // Get user ID from request body
      const findUser = await UserModel.findOne({ _id: id }); // Find user by ID
  
      if (!findUser) {
        return res.status(400).json({ success: false, message: 'User does not exist' }); // Return error if user not found
      }
  
      // Assuming Used is an array or object property in findUser
      const items = findUser.Used;
  
      if (!items) { // Check if items exist and are not empty
        return res.status(404).json({ success: false, message: 'No items found for this category' }); // Return error if no items found
      }
  
      // If items exist, return them
      res.status(200).json({ success: true, items }); // Return success with items
    } catch (err) {
      res.status(500).json({ success: false, message: 'Internal server error', error: err.message }); // Return error with success: false
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.post('/deleteUsedItem', async (req, res) => {
    try {
      const { id, topUrl, btmUrl } = req.body;
  
      const user = await UserModel.findOne({ _id: id });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Filter out the item in `Used` that matches topUrl and btmUrl
      user.Used = user.Used.filter(item => !(item[0] === topUrl && item[1] === btmUrl));
  
      // Save the updated document back to the database
      await user.save();
      res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Start the server only after the DB connection is successful