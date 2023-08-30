const Ticket = require('../../mongoose/database/schemas/Ticket'); // Assuming Ticket.js is in the same directory
const client = require("../../"); // Assuming this is your Discord.js client
const api = require("express").Router();

api.get('/github-issues', (req, res) => {
    fetch(`https://api.github.com/repos/${client.config.github.repoOwner}/${client.config.github.repoName}/issues`, {
        headers: {
            Authorization: `Bearer ${client.config.github.githubToken}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching GitHub issues');
            }
            return response.json();
        })
        .then(issues => {
            res.json(issues);
        })
        .catch(error => {
            console.error('Error fetching GitHub issues:', error);
            res.status(500).json({ error: 'Could not fetch GitHub issues' });
        });
});

module.exports = api;