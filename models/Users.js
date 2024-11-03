const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    // Change urls field to an array of objects with url, date, and usedTime properties
    urls: { 
      type: [
        {
          url: { type: String, required: true },
          dateAdded: { type: Date, default: Date.now },
          usedTime: { type: Number, default: 0 }
        }
      ], 
      default: [] 
    }
  }, { _id: false }); // Disable automatic _id for each category object
const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    category: { type: [categorySchema], default: [] }, // Array of categories with no automatic _id
    Used: { type: [[String]], default: [] } // Array of arrays for [topUrl, btmUrl] pairs
});

const UserModel = model("User", UserSchema);
module.exports = UserModel;
