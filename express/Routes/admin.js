const client = require("../../");
const api = require("express").Router();

api.get('/',async(req,res) => {
    let data = await client.guilds.cache;
    let name = client.guilds.cache.map(guild => {
        return {
            name: guild.name,
        }
    });

    res.send({status:true,data:Array.from(name)});
});


module.exports = api;