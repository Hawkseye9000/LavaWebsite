const mongoose = require('mongoose');

const PremuimSchema = new mongoose.Schema({
    guildId: {
        type: mongoose.SchemaTypes.String,
        require: true,
        unique: true,
    },
    token: {
        type: mongoose.SchemaTypes.String,
        require: false,
        default: null,
        unique: true,
    },
    time: {
        type: mongoose.SchemaTypes.Date,
        require: false,
        default: '1990-01-01T00:00:00.000+00:00',
    },
    blackList: {
        type: mongoose.SchemaTypes.Boolean,
        require: false,
        default: false,
    },
});

module.exports = mongoose.model('Premuim', PremuimSchema);