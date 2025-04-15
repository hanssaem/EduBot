const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User email
    title: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    reviewInterval: { type: Number, default: 7 }, // 복습 주기 (일)
    checked: { type: Boolean, default: false },   // 복습 완료 여부
});

module.exports = mongoose.model('Note', noteSchema);
