const client = require("../../");
const api = require("express").Router();
const Redeem = require("../../mongoose/database/schemas/Redeem");

api.get('/', async (req, res) => {
    const data = await Redeem.find({ userID: req.user.discordId });
    if (data) return res.send(data)
    else return res.send(false);
});

module.exports = api;