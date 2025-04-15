const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    reviewSchedule: {
        type: [Date],
        default: function () {
            const now = new Date();
            return [
                new Date(now.getTime() + 10 * 60 * 1000),             // +10분
                new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),     // +1일
                new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),     // +7일
                new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),    // +30일
            ];
        },
    },

    reviewedDates: {
        type: [Date],
        default: [],
    },
});


module.exports = mongoose.model('Note', noteSchema);
