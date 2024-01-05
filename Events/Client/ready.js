const mongoose = require('mongoose');
const chalk = require('chalk');
const { ActivityType } = require("discord.js");
const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Client ready! Logged in as ${client.user.username} with ${client.guilds.cache.size} guilds\nPing: ${client.ws.ping}ms`);
    client.user.setActivity(`with ${client.guilds.cache.size} guilds`);
    console.log(chalk.bold("Connecting to the database..."));

    try {
      let progress = 10;
      const progressUpdateInterval = 10; // Increase to set more frequent updates
      const maxProgress = 100;

      while (progress <= maxProgress) {
        console.log(chalk.yellow.bold(`Database Connecting: ${progressBar(progress)}`));
        await new Promise(resolve => setTimeout(resolve, 500)); // Increased to 0.5 second delay
        progress += progressUpdateInterval;
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Increased to 1 second delay

      mongoose.connection.on('connecting', () => {
        console.log(chalk.gray.bold('Database Connection: Attempting to connect...'));
      });

      mongoose.connection.on('connected', () => {
        console.log(chalk.green.bold('Database Connection: ✅ Connected'));
      });

      mongoose.connection.on('error', (error) => {
        console.error(chalk.red.bold('Error connecting to the database:', error.message));
      });

      mongoose.connection.on('disconnected', () => {
        console.log(chalk.red.bold('Database Connection: ❌ Disconnected'));
      });

      await mongoose.connect(process.env.database, {
        serverSelectionTimeoutMS: 15000
      });

      if (mongoose.connection.readyState !== 1) {
        console.log(chalk.red.bold('Database Connection: ❌ Weak'));
      }

      // Adding a 1-second delay here before printing "Ence is now online."
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(chalk.blue.bold(`${client.user.username} is now connected to database.`));
    } catch (error) {
      console.error(chalk.red.bold('Error connecting to the database:', error.message));
      console.log(chalk.red.bold('Database Connection: ❌ Failed'));
    }

    setInterval(() => {
      const index = Math.floor(Math.random() * client.config.activities_list.length);
      const targetGuild = client.guilds.cache.get("429089094690275338");
      if (targetGuild) {
        client.user.setPresence({
          activities: [{
            name: client.config.New_Year + ' with ' + targetGuild.memberCount + ' people',
            type: ActivityType.Playing,
          }],
          status: 'dnd',
        });
      }
    }, 10000);

    loadCommands(client);
  }
};

function progressBar(progress) {
  const width = 20;
  const percentage = Math.floor(progress / 100 * width);
  const progressBar = `${'='.repeat(percentage)}${' '.repeat(width - percentage)}`;
  return `[${progressBar}] ${progress}%`;
}
