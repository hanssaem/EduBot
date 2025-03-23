const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User와 연결
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
