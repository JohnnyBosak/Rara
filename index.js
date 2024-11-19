require('dotenv').config();
const keepAlive = require(`./server`);
keepAlive();

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
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
const { AppleMusicPlugin } = require('distube-apple-music');
const { TidalPlugin } = require('distube-tidal');
const { YandexMusicPlugin } = require('distube-yandex-music-plugin');
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
      new AppleMusicPlugin(),
      new TidalPlugin(),
      //new YandexMusicPlugin({ oauthToken: "your_token", uid: "your_uid"}),
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
  customFilters: {
    '3d': 'apulsator=hz=0.125',
    'bassboost': 'bass=g=10',
    'echo': 'aecho=0.8:0.9:1000:0.3',
    'flanger': 'flanger',
    'gate': 'agate',
    'haas': 'haas',
    'karaoke': 'stereotools=mlev=0.1',
    'nightcore': 'asetrate=48000*1.25,aresample=48000,bass=g=5',
    'reverse': 'areverse',
    'vaporwave': 'asetrate=48000*0.8,aresample=48000,atempo=1.1',
    'mcompand': 'mcompand',
    'phaser': 'aphaser',
    'tremolo': 'tremolo',
    'surround': 'surround',
    'earwax': 'earwax'
  },
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