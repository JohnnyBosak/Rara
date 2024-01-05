const keepAlive = require(`./server`);
keepAlive();

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildModeration, GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks, GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping, DirectMessages, DirectMessageReactions, DirectMessageTyping, MessageContent, GuildScheduledEvents } = GatewayIntentBits;

const { User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildModeration, GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks, GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping, DirectMessages, DirectMessageReactions, DirectMessageTyping, MessageContent, GuildScheduledEvents],
  partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent]
});

const { DisTube } = require("distube");

const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');


client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: false,// you can change this to your needs
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});
module.exports = client;

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.guildConfig = new Collection();

/*
const { connect } = require("mongoose");
async function connectToDatabase() {
  try {
    await connect(process.env.database, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
    });
    console.log("The client is now connected to the Mongo database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectToDatabase, 5000);
  }
}
connectToDatabase();
*/
loadEvents(client);

const { loadConfig } = require("./Functions/configLoader");
loadConfig(client);

const { GiveawaysManager } = require("discord-giveaways");
client.giveawayManager = new GiveawaysManager(client, {
  default: {
    botsCanWin: false,
    embedColor: "#a200ff",
    embedColorEnd: "#550485",
    reaction: "🎉",
  },
});

client.login(process.env.token)
  .then(() => {
    client.on("debug", (e) => console.log(e));
  }).catch((err) => console.log(err));
