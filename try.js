
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-k1GsSP1CD6Sf664V--ygJmW5D8EE5Qo",
  authDomain: "eleanor-3aa19.firebaseapp.com",
  projectId: "eleanor-3aa19",
  storageBucket: "eleanor-3aa19.appspot.com",
  messagingSenderId: "123977754592",
  appId: "1:123977754592:web:94371ab17c2e4c20f36d85",
  measurementId: "G-2KVH10BH2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

















// // forGet pass taken
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service:'gmail',
//   auth: {
//     user: 'eeleanor508@gmail.com', // Your email
//     pass: '7797596863', // Your email password (use an app password or OAuth for security)
//   },
// });

// app.post('/getPass', async (req, res) => {
//   try {
//     const { name } = req.body;
//     const findUser = await UserModel.findOne({ username: name });
//     if (!findUser) {
//       return res.status(400).json({ success: false, message: 'Username does not exist' });
//     }
//     if (!findUser.email) {
//       return res.status(400).json({ success: false, message: 'Email is not available for this user' });
//     }
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//     // Send email with the verification code
//     const mailOptions = {
//       from: 'eeleanor508@gmail.com',
//       to: 'fm883254@gmail.com',
//       // to: findUser.email,
//       subject: 'Your Verification Code',
//       text: `Hello ${findUser.username},\n\nYour verification code is: ${verificationCode}\n\nThank you!`,
//     };


//     // Send the email
//      transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).json({ success: false, message: 'Failed to send verification email', error: error.message });
//       }

//       console.log('Email sent: ' + info.response);
//       // Return the password and indicate that the verification email was sent
//       res.status(200).json({
//         success: true,
//         password: findUser.password,
//         message: 'Verification code sent to your email',
//       });
//     });

//   } catch (err) {
//     console.error('Error fetching password:', err);g
//     res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
//   }
// });




















// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');

// // Initialize S3 client
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// // Configure multer to use S3
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME,
//     acl: 'public-read', // Set file permissions
//     key: (req, file, cb) => {
//       cb(null, `${Date.now().toString()}-${file.originalname}`); // Unique file name
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed"), false);
//     }
//   },
// });

// // Route for uploading images
// app.post("/uploadImage/:id/:catKey", upload.single("image"), async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const catKey = req.params.catKey;

//     const imagePath = req.file.location; // S3 URL of the uploaded image

//     const update = { $push: { [`category.${catKey}`]: imagePath } };

//     const updatedUser = await UserModel.findByIdAndUpdate(userId, update, { new: true });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "Image uploaded successfully", user: updatedUser });
//   } catch (err) {
//     res.status(500).json({ message: "Error uploading image", error: err.message });
//   }
// });






const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Initialize multer with the defined storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Create directory for uploads if it doesn't exist
const fs = require('fs');

const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Add image to a specific user by ID

app.post("/uploadImage/:id/:catKey", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const catKey = req.params.catKey;

    const imagePath = req.file.path;

    const update = { $push: { [`category.${catKey}`]: imagePath } };

    const updatedUser = await UserModel.findByIdAndUpdate(userId, update, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Image uploaded successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
});
