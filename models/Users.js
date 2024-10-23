const { Schema, model } = require("mongoose");
const UserSchema = new Schema({
    _id: { type: String },
    name: { type: String },
    username: { type: String },
    password: { type: String },
})
const UserModel = model("users", UserSchema);
module.exports = UserModel