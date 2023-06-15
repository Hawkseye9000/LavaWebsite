const client = require("../../");
const api = require("express").Router();
const Auth = require("../Middlewares/Auth");
const Stats = require("../../mongoose/database/schemas/Stats")
api.get('/', Auth, async (req, res) => {
    if (req.user)
        return res.send(req.user);
    else return res.send(false);
});

api.get('/stats', Auth, async (req, res) => {
    try {
        const userId = req.user.discordId;

        // Retrieve user's stats from the database
        const userStats = await Stats.findOne({ discordId: userId });

        // Calculate total songs played by all users
        const totalSongs = await Stats.aggregate([{ $group: { _id: null, total: { $sum: "$songsCounter" } } }]);

        // Extract the total songs count from the aggregation result
        const totalSongsCount = totalSongs.length > 0 ? totalSongs[0].total : 0;

        // Calculate total commands executed by all users
        const totalCommands = await Stats.aggregate([{ $group: { _id: null, total: { $sum: "$commandsCounter" } } }]);

        // Extract the total commands count from the aggregation result
        const totalCommandsCount = totalCommands.length > 0 ? totalCommands[0].total : 0;

        // Prepare the JSON response
        const responseData = {
            userSongs: userStats.songsCounter,
            totalSongs: totalSongsCount,
            userSongsPercentage: (userStats.songsCounter / totalSongsCount) * 100,
            userCommands: userStats.commandsCounter,
            totalCommands: totalCommandsCount,
            userCommandsPercentage: (userStats.commandsCounter / totalCommandsCount) * 100
        };

        return res.json(responseData);
    } catch (error) {
        // Handle any errors that occur during the operation
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
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