const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    category: { type: Schema.Types.Mixed } // Allows for dynamic type

});

const UserModel = model("users", UserSchema);
module.exports = UserModel;
