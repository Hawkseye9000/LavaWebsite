const client = require("../../"); // Assuming this is your Discord.js client
const api = require("express").Router();
const { Auth, Administrator } = require('../Middlewares');

api.post('/:userId/:newLevel', Auth, Administrator, async (req, res) => {
    try {
        const userId = req.params.userId;
        const newLevel = parseInt(req.params.newLevel);

        if (!userId || isNaN(newLevel)) {
            return res.status(400).send('Invalid parameters.');
        }

        const member = await client.guilds.cache.get('947967652675072051').members.fetch(userId);

        if (!member) {
            return res.status(404).send('Member not found.');
        }

        let roleId;

        switch (newLevel) {
            case 1:
                roleId = '1051662258373136471';
                break;
            case 2:
                roleId = '1051662275158741043';
                break;
            case 3:
                roleId = '1051664084774424686';
                break;
            default:
                return res.status(400).send('Invalid newLevel.');
        }

        const role = member.guild.roles.cache.get(roleId);

        if (!role) {
            return res.status(404).send('Role not found.');
        }

        // Remove the old level role (if any)
        const oldLevelRoles = ['1051662258373136471', '1051662275158741043', '1051664084774424686'];
        const oldRolesToRemove = member.roles.cache.filter(role => oldLevelRoles.includes(role.id));
        await member.roles.remove(oldRolesToRemove);

        // Add the new level role
        await member.roles.add(role);

        res.send('User upgraded successfully.');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

module.exports = api;