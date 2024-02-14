const { ChatInputCommandInteraction } = require("discord.js");

module.exports = {
  subCommand: "guild.leave",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
      const DoNotLeaveGuilds = ["429089094690275338", "881899387419258921", "794346100534411315"];
      
      const guild = await client.guilds.cache.get(interaction.options.getString("id"));
      if (!guild) {      
          return interaction.reply(`Unable to find a guild with ID ${guildId}`);
      }
    
      if (DoNotDeleteGuilds.includes(guild.id)) {
          return interaction.reply({ content: "Cannot leave Leisha, Johnny and Grom servers." });
      }

      try {
        await guild.leave();
        interaction.reply(`Successfully left **${guild.name}** (${guild.id})`);
          
      } catch (error) {
        console.error(`Error leaving guild ${guild.name}:`, error);
        interaction.reply(`An error occurred while leaving the guild **${guild.name}** (${guild.id})`);
      }
  },
};
