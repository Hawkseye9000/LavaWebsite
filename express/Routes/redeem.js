const client = require("../../");
const api = require("express").Router();
const Redeem = require("../../mongoose/database/schemas/Redeem");

api.get('/', async (req, res) => {
    if (req.user) {
        const data = await Redeem.find({ userId: req.user.discordId });
        if (data) return res.send(data)
    }
    else return res.send(false);
});

module.exports = api;