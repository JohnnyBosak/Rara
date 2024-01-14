const { EmbedBuilder } = require("discord.js");
const banLogDatabase = require("../../Schemas/BanLog");

module.exports = {
  name: "guildBanAdd",
  
  async execute(ban) {
    const guildConfig = await banLogDatabase.findOne({
      Guild: ban.guild.id
    });
    if (!guildConfig) return;

    const logChannel = guildConfig ? ban.guild.channels.cache.get(guildConfig.logChannel) : null;
    if (!logChannel) return;

    const fetchedLogs = await ban.guild.fetchAuditLogs({
      limit: 1,
      type: "22",
    });
    
    const banLog = fetchedLogs.entries.first();
    if (!banLog) return;
    
    const { executor, target } = banLog;
    const embed = new EmbedBuilder()
      .setColor("#f04848")
      .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL({ dynamic: true, size: 256}), })
      .setDescription(`**👮‍♂️ 🔒 <@${target.id}> was banned by ${executor.tag}**.`)
      .setThumbnail(target.displayAvatarURL())
      .setFooter({ text: `ID: ${target.id}` })
      .setTimestamp();
    logChannel.send({ embeds: [embed] });
  },
};
