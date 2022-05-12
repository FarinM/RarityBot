import { Connection, programs } from "@metaplex/js";
const {
  metadata: { Metadata },
} = programs;
import axios from "axios";
import { Client, Intents, MessageAttachment } from "discord.js";
import { createRequire } from "module"; //
const require = createRequire(import.meta.url);
const my_json_file = require("./config.json");
var fs = require("fs");
const json = require("./tokens.json");

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});



client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  const data = new Map();
  const map1 = new Map();
  let rarityList = new Map();

  if (message.content.startsWith("!rarity")) {

    let i = 0;
    for (var a of json) {
      i++;
      let con = new Connection("http://185.191.127.226:8899/");

      const metadata1 = await Metadata.load(con, await Metadata.getPDA(a));
      let b = await axios.get(metadata1.data.data.uri);
    
      for (var key in b.data.attributes) {
        let s = `${JSON.stringify(
          b.data.attributes[key].trait_type
        )}_${JSON.stringify(b.data.attributes[key].value)}`.replaceAll('"', "");
    
        if (map1.get(s) == null) {
          map1.set(s, 1);
        } else {
          map1.set(s, map1.get(s) + 1);
        }

        data.set(a, b.data.attributes)
      }
    }
    await getPercentage(i, map1);
    await getNftRarity(data, map1, rarityList)

    message.reply("finished");
  }

  if (message.content.startsWith("!map")) {
    console.log(map1);
  }
});

// Login to Discord with your client's token
client.login(my_json_file.token);


async function getPercentage(total, map1) {
  for (let [key, value] of map1.entries()) {
    map1.set(key, value / total);
  }
}

async function getNftRarity(data, map1, rarityList) {

  for (var a of json) {
    let num = 1;
    const metadata = data.get(a);
    for (var key in metadata) {
      let s = `${JSON.stringify(
        metadata[key].trait_type
      )}_${JSON.stringify(metadata[key].value)}`.replaceAll('"', "");

      num = num * map1.get(s);
    }
    rarityList.set(a, num)
  }
  rarityList = new Map([...rarityList.entries()].sort((a, b) => b[1] - a[1]));

  console.log(rarityList)

}
