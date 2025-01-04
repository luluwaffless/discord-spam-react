const { Client } = require('discord.js-selfbot-v13');
const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const client = new Client();
let channels = {};
let users = {};
let guilds = {};
function getMessage(channelId, messageId, details) {
    return new Promise(async (r) => {
        const channel = await client.channels.fetch(channelId);
        const message = await channel.messages.fetch(messageId);
        return r(details ? {content: message.content, author: `${message.author.globalName} (@${message.author.username})`, avatar: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.jpeg`} : message);
    });
}
function reactMessage(channelId, messageId, emojis) {
    return new Promise(async (r) => {
        const message = await getMessage(channelId, messageId);
        for (let i = 0; i <= emojis.length; i++) {
            if (i === emojis.length) return r("reacted all emojis!");
            try {
                await message.react(emojis[i]);
            } catch (error)  {
                if (error.name === 'DiscordAPIError' && error.message.includes('Maximum number of reactions reached (20)')) {
                    return r(`reactions full, reacted ${i} emojis`);
                }
                throw error;
            };
        };
    });
};

client.once('ready', async () => {
    console.log(`👤 logged in as ${client.user.username}`);
    const app = express();
    app.use(express.static("public"));
    app.use(bodyParser.json());
    app.get("/", (_, res) => {
        res.redirect("/messages.html");
    });
    app.get("/username", (_, res) => {
        res.send(client.user.username);
    });

    // messages
    app.get("/message", async (req, res) => {
        const { channelId, messageId } = req.query;
        res.json(await getMessage(channelId, messageId, true));
    });
    app.post("/message", async (req, res) => {
        const { channelId, messageId, emojis } = req.body;
        res.send(await reactMessage(channelId, messageId, emojis));
    });

    // channels
    app.get("/channels", async (_, res) => {
        res.json(channels);
    });
    app.get("/channel", async (req, res) => {
        const channel = await client.channels.fetch(req.query.id);
        if (channel && channel.name) {
            res.send(channel.name);
        } else {
            res.sendStatus(404);
        };
    });
    app.post("/channel", async (req, res) => {
        channels[req.body.id] = { name: req.body.name, emojis: req.body.emojis }
        res.send("saved successfully!");
    });
    app.delete("/channel", async (req, res) => {
        if (!channels[req.body.id]) return res.sendStatus(400);
        delete channels[req.body.id];
        res.send("deleted successfully!");
    });
    
    // users
    app.get("/users", async (_, res) => {
        res.json(users);
    });
    app.get("/user", async (req, res) => {
        const user = await client.users.fetch(req.query.id);
        if (user && user.username) {
            res.send(user.username);
        } else {
            res.sendStatus(404);
        };
    });
    app.post("/user", async (req, res) => {
        users[req.body.id] = { name: req.body.name, emojis: req.body.emojis }
        res.send("saved successfully!");
    });
    app.delete("/user", async (req, res) => {
        if (!users[req.body.id]) return res.sendStatus(400);
        delete users[req.body.id];
        res.send("deleted successfully!");
    });

    // guilds
    app.get("/guilds", async (_, res) => {
        res.json(guilds);
    });
    app.get("/guild", async (req, res) => {
        const guild = await client.guilds.fetch(req.query.id);
        if (guild && guild.name) {
            res.send(guild.name);
        } else {
            res.sendStatus(404);
        };
    });
    app.post("/guild", async (req, res) => {
        guilds[req.body.id] = { name: req.body.name, emojis: req.body.emojis }
        res.send("saved successfully!");
    });
    app.delete("/guild", async (req, res) => {
        if (!guilds[req.body.id]) return res.sendStatus(400);
        delete guilds[req.body.id];
        res.send("deleted successfully!");
    });

    app.listen(80, () => console.log("✅ live on http://localhost"));
});

client.on('messageCreate', async (msg) => {
    const { channel, channelId, id, guildId, author } = msg;
    if (guilds[guildId]) {
        console.log(`[${new Date().toISOString()}] reacting to ${id} by ${author.username} in #${channel.name} (guild trigger)`);
        await reactMessage(channelId, id, guilds[guildId].emojis);
    };
    if (channels[channelId]) {
        console.log(`[${new Date().toISOString()}] reacting to ${id} by ${author.username} in #${channel.name} (channel trigger)`);
        await reactMessage(channelId, id, channels[channelId].emojis);
    };
    if (users[author.id]) {
        console.log(`[${new Date().toISOString()}] reacting to ${id} by ${author.username} in #${channel.name} (user trigger)`);
        await reactMessage(channelId, id, users[author.id].emojis);
    };
});

client.login(process.env.token);