const mongoose = require('mongoose');

const BankingSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    balance: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    bankrob: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    daily: {
        type: mongoose.SchemaTypes.Date,
        required: false,
        default: null,
    },
    deposit: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    dig: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    drop: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    farm: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    fish: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    // Add other commands here as needed

});

module.exports = mongoose.model('Banking', BankingSchema);