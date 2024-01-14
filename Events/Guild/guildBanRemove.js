const { EmbedBuilder } = require("discord.js");
const banLogDatabase = require("../../Schemas/BanLog");

module.exports = {
  name: "guildBanRemove",

  async execute(ban) {
    const guildConfig = await banLogDatabase.findOne({
      Guild: ban.guild.id
    });
    if (!guildConfig) return;

    const logChannel = guildConfig ? ban.guild.channels.cache.get(guildConfig.logChannel) : null;
    if (!logChannel) return;

    const fetchedLogs = await ban.guild.fetchAuditLogs({
      limit: 1,
      type: "23",
    });

    const unbanLog = fetchedLogs.entries.first();
    if (!unbanLog) return;

    const { executor, target } = unbanLog;

    const embed = new EmbedBuilder()
      .setColor("#43b581")
      .setAuthor({
        name: target.tag,
        iconURL: target.displayAvatarURL({ dynamic: true, size: 256 })
      })
      .setDescription(`**🔓 <@${target.id}> was unbanned by ${executor.tag}.**`)
      .setThumbnail(target.displayAvatarURL())
      .setFooter({ text: `ID: ${target.id}` })
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  },
};
