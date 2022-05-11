import { Connection, programs } from "@metaplex/js";
const {
  metadata: { Metadata },
} = programs;
import axios from "axios";
import { Client, Intents } from "discord.js";
import { createRequire } from "module"; // 
const require = createRequire(import.meta.url); 
const my_json_file = require("./config.json"); 
var fs = require("fs");

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const map1 = new Map();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!rarity")) {
    let con = new Connection("http://185.191.127.226:8899/");

    const metadata1 = await Metadata.load(
      con,
      await Metadata.getPDA("A53por1wdeeaTUhrHpk6fjiuumDi46e7UwnDRVd5CtwT")
    );
    let a = await axios.get(metadata1.data.data.uri);
    let jsn = JSON.stringify(a.data.attributes);

    for (var key in a.data.attributes) {
      let s = `${JSON.stringify(
        a.data.attributes[key].trait_type
      )}_${JSON.stringify(a.data.attributes[key].value)}`.replaceAll('"', "");

      if(map1.get(s) == null){
        map1.set(s, 1)
      } else {
        map1.set(s, map1.get(s) +1)
      }
      console.log(s);
    }

    fs.writeFile("thing.json", jsn, function (err, result) {
      if (err) console.log("error", err);
    });

    message.reply({
      files: ["./thing.json"],
    });
  }

  if (message.content.startsWith("!map")) {
    console.log(map1)
  }
});

// Login to Discord with your client's token
client.login(my_json_file.token);
