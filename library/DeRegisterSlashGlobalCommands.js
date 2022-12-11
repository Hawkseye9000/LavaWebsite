const { Client } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

/**
 * Register slash commands for a guild
 * @param {require("./library/MusicBot")} client
 * @param {string} guild
 */

module.exports = (client) => {

    const rest = new REST({ version: '10' }).setToken(client.config.Token);

    (async () => {
        try {
            await rest.get(Routes.applicationCommands(client.config.Id))
                .then(data => {
                    const promises = [];
                    for (const command of data) {
                        const deleteUrl = `${Routes.applicationCommands(client.config.Id)}/${command.id}`;
                        promises.push(rest.delete(deleteUrl));
                    }
                    return Promise.all(promises);
                }).catch(err => { client.error(err) })
        } catch (error) {
            client.error(error);
        }
    })();
};
