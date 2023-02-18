const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set a schema for the "user" collection
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// creats a model for the 'user' collection that will be part of the export
const User = mongoose.model('user', userSchema);

module.exports = { User };
