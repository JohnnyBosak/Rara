const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const database = require("../../../../Schemas/MemberLog");

module.exports = {
  subCommand: "setup.welcome",
  /** 
  * @param  {ChatInputCommandInteraction} interaction
  */
  async execute(interaction, client) {
    const { guild, options } = interaction;

    const logChannel = options.getChannel("log_channel")?.id || null;
    const memberRole = options.getRole("member_role_add")?.id || null;
    const botRole = options.getRole("bot_role_add")?.id || null;
    const welcomeChannel = options.getChannel("welcome_channel")?.id || null;

    const guildConfigObject = {
      logChannel: logChannel,
      memberRole: memberRole,
      botRole: botRole,
      welcomeChannel: welcomeChannel
    };

    await database.findOneAndUpdate(
      { Guild: guild.id },
      guildConfigObject,
      { new: true, upsert: true }
    );

    client.guildConfig.set(guild.id, guildConfigObject);

    const Embed = new EmbedBuilder()
      .setColor("Green")
      .setAuthor({ name: "Welcome system", iconURL: "https://media.discordapp.net/attachments/430778195789348874/1138012783993163807/welcome.gif" })
      .setDescription([
        `- Member Logging Channel: ${logChannel ? `<#${logChannel}>` : "Not Specified."}`,
        `- Member Join-Role: ${memberRole ? `<@&${memberRole}>` : "Not Specified."}`,
        `- Bot Join-Role: ${botRole ? `<@&${botRole}>` : "Not Specified."}`,
        `- Welcome Channel: ${welcomeChannel ? `<#${welcomeChannel}>` : "Not Specified."}`
      ].join("\n"));

    return interaction.reply({ embeds: [Embed] });
  }
};
