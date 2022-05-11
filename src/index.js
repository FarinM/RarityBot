// Require the necessary discord.js classes
import { Connection, programs } from '@metaplex/js';
const { metadata: { Metadata } } = programs;
import axios from "axios";
import { Client, Intents } from "discord.js";
import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
const my_json_file = require("./config.json") //'
var fs = require('fs');


// Create a new client instance
const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const map1 = new Map();

// When the client is ready, run this code (only once)
client.once("ready", () => {
    map1.set('a', 1);
  console.log("Ready!");
  console.log("add")
});


client.on('messageCreate', async message => {
    console.log("!rarity");
  if (message.content.startsWith("!rarity")) {
    let con = new Connection('mainnet-beta');

    const metadata1 = await Metadata.load(con, await Metadata.getPDA("5bvfccqM5i9K8onJffUxUnDZoabcG8fGwpURwELtYB9F"));
    let a = await axios.get(metadata1.data.data.uri);
    console.log(a.data)
    let jsn = JSON.stringify(a.data)



    fs.writeFile("thing.json", jsn, function(err, result) {
        if(err) console.log('error', err);
    });

    message.reply({
        files: ['./thing.json']
    })
  }
});

// Login to Discord with your client's token
client.login(my_json_file.token);
