const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const database = require("../../../../Schemas/ClearLog");

module.exports = {
  subCommand: "setup.clear_log",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("channel")?.id || null;

    await database.findOneAndUpdate(
      { Guild: guild.id },
      { logChannel: logChannel },
      { new: true, upsert: true }
    );

    client.guildConfig.set(guild.id, { logChannel: logChannel });

    const Embed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(`- **Cleared messages logging Channel Updated :** ${logChannel ? `<#${logChannel}>` : "Not set."}`);

    return interaction.reply({ embeds: [Embed] });
  }
};