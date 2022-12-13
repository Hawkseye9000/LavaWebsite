const client = require("../../");
const api = require("express").Router();
const Auth = require("../Middlewares/Auth");

api.get('/', Auth, async (req, res) => {
    if (req.user)
        return res.send(req.user);
    else return res.send(false);
});

api.get('/guilds', async (req, res) => {
    if (req.user)
        return res.send(req.user.guilds);
    else return res.send(false);
});

api.get('/bot', async (req, res) => {
    client.ping = client.ws.ping;
    return res.send(client);
});

module.exports = api;