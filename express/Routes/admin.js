const client = require("../../"); // Assuming this is the path to your Discord client initialization
const { Router } = require("express"); // Importing Router from express

const { PermissionsBitField } = require('discord.js');

const api = Router(); // Creating an instance of Router

api.get('/', async (req, res) => {
    try {
        let data = await client.guilds.cache;
        let name = await Promise.all(data.map(async guild => {
            let admins = await getGuildMembers(guild.id);
            return {
                name: guild.name,
                admins: admins
            };
        }));

        res.send({ status: true, data: name });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: false, message: 'Internal server error' });
    }
});

async function getGuildMembers(guildId) {
    const guild = client.guilds.cache.get(guildId);

    if (guild) {
        // Fetch all members to ensure complete data
        await guild.members.fetch();

        // Filter members with ADMINISTRATOR permission and exclude the bot
        const adminMembers = guild.members.cache.filter(
            member => member.permissions.has(PermissionsBitField.Flags.ManageGuild) && !member.user.bot
        );

        let adminUser = [];

        adminMembers.forEach((am) => {
            adminUser.push({
                user: am.user.username
            });
        });

        return adminUser;
    } else {
        throw new Error('Guild not found');
    }
}

module.exports = api;
