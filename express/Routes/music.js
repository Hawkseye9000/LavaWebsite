const client = require("../..");
const SaveMusic = require("../../mongoose/database/schemas/SaveMusic");
const api = require("express").Router();

api.get('/save', async (req, res) => {
    if (req.user) {
        const data = await SaveMusic.find({ userID: req.user.discordId });
        if (data) return res.send(data)
    }
    else return res.send(false);
});

module.exports = api;