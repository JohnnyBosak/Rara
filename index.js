require('dotenv').config();
const keepAlive = require(`./server`);
keepAlive();

const { Client, GatewayIntentBits, Partials, Collection, WebhookClient } = require("discord.js");
const { Guilds, GuildMembers, GuildModeration, GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks, GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping, DirectMessages, DirectMessageReactions, DirectMessageTyping, MessageContent, GuildScheduledEvents, AutoModerationConfiguration, AutoModerationExecution, GuildMessagePolls, DirectMessagePolls } = GatewayIntentBits;

const { User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildModeration, GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks, GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping, DirectMessages, DirectMessageReactions, DirectMessageTyping, MessageContent, GuildScheduledEvents, AutoModerationConfiguration, AutoModerationExecution, GuildMessagePolls, DirectMessagePolls],
  partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent]
});

const fs = require('fs');
const { DisTube } = require("distube");

const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YouTubePlugin } = require('@distube/youtube');
const { DeezerPlugin } = require('@distube/deezer');
const { DirectLinkPlugin } = require('@distube/direct-link');
const { FilePlugin } = require('@distube/file');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { Player } = require('discord-player');
const cookiesJson = JSON.parse(fs.readFileSync('./youtube_cookies.json', 'utf8'));

client.setMaxListeners(200);
client.distube = new DisTube(client, {
  emitNewSongOnly: true,// This setting indicates that DisTube will only emit the playSong event when a new song starts playing
  //leaveOnFinish: false,// you can change this to your needs
  emitAddSongWhenCreatingQueue: false,
  plugins: [
      new SpotifyPlugin(),
      new SoundCloudPlugin(),
      new DeezerPlugin(),
      new DirectLinkPlugin(),
      new FilePlugin(),
      new YouTubePlugin(),
      new YtDlpPlugin({
      update: true,
      cookies: cookiesJson || undefined, // Use cookies if they are successfully loaded
      requestOptions: {
        headers: {
          cookie: cookiesJson ? cookiesJson.toString() : '' // Use the cookie string if available
        }
      }
    })
  ],
  nsfw: true,
});
client.distube.setMaxListeners(200);

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

const webhookClient = new WebhookClient({ url: process.env.debianWebhook });

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  webhookClient.send({
    content: `Unhandled Rejection at: ${promise}\nReason: ${reason}`
  });
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  webhookClient.send({
    content: `Uncaught Exception: ${error.message}\nStack: ${error.stack}`
  });
  process.exit(1); // Optional: Exit the process after handling the exception
});

client.login(process.env.token)
  .then(() => {
    client.on("debug", (e) => console.log(e));
  }).catch((err) => console.log(err));