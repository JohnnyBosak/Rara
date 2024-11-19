const { ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { create } = require('sourcebin');

module.exports = {
  subCommand: "guild.list",
  /** 
  *
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    try {
      const guilds = interaction.client.guilds.cache;
      let guildList = "";

      for (const [guildId, guild] of guilds) {
        const owner = await guild.fetchOwner();
        const invites = guild.members.me.permissions.has(PermissionFlagsBits.CreateInstantInvite) ? await guild.invites.fetch() : null;

        if (!owner) continue;

        guildList +=
            `**Guild**: ${guild.name} (${guildId})  \n` +
            `**Members**: ${guild.memberCount}  \n` +
            `**Owner**: ${owner.user} (${owner.user.id})  \n` +
            `**Invite**: ${invites?.size > 0 ? invites.first().url : "/"}\n\n`;
      }

      const bin = await create(
          {
              title: 'Guilds list',
              description: 'List of guilds that the bot is in',
              files: [
                  {
                      content: guildList,
                      name: 'Rara Guilds',
                      language: 'markdown',
                  },
              ],
          },
      );

      await interaction.reply({
        content: bin.url
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "An error occurred while listing the guilds.", ephemeral: true });
    }
  },
};