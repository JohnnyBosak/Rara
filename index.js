const keepAlive = require(`./server`);
keepAlive();

const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require("discord.js");
const { Guilds, GuildMembers, GuildModeration, GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks, GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping, DirectMessages, DirectMessageReactions, DirectMessageTyping, MessageContent, GuildScheduledEvents } = GatewayIntentBits;

const { User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildModeration, GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks, GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping, DirectMessages, DirectMessageReactions, DirectMessageTyping, MessageContent, GuildScheduledEvents],
  partials: [User, Message, GuildMember, ThreadMember, Channel, Reaction, GuildScheduledEvent]
});

const { loadEvents } = require("./Handlers/eventHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.guildConfig = new Collection();


const { connect } = require("mongoose");
async function connectToDatabase() {
  try {
    await connect(process.env.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
    console.log(`client logged in as ${client.user.username} with ${client.guilds.cache.size} guilds`);
    client.user.setActivity(`with ${client.guilds.cache.size} guilds`);
    setInterval(() => { //+
      const index = Math.floor(Math.random() * (client.config.activities_list.length - 1) + 1);
      const targetGuild = client.guilds.cache.get("429089094690275338")
      if (targetGuild) {
        client.user.setPresence({
          activities: [{
            name: client.config.activities_list[index] + ' with ' + targetGuild.memberCount + ' people',
            type: ActivityType.Listening
          }],
          status: 'dnd',
        });
      }
    }, 10000); //+
    //client.on("debug", (e) => console.log(e));

  }).catch((err) => console.log(err));
