const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },  // Google UID
    email: { type: String, required: true, unique: true } // 이메일
});

module.exports = mongoose.model('User', userSchema);
