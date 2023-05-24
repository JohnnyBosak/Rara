const { SlashCommandBuilder, PermissionFlagsBits } = require(`discord.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Set up the Automod System')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) => options
      .setName('flagged-words')
      .setDescription('Block profanity, sexual content and slurs')
                  )
    .addSubcommand((options) => options
      .setName('spam-messages')
      .setDescription('Block messages suspected of spam')
                  )
    .addSubcommand((options) => options
      .setName('mention-spam')
      .setDescription('Block messages containing a certain amount of mentions')
      .addNumberOption((options) =>
        options
        .setName('number')
        .setDescription('The number of mentions required to block a message')
        .setRequired(true),
                       ),
                  )
    .addSubcommand((options) => options
      .setName('keyword')
      .setDescription('Block a given keyword in the server')
      .addStringOption((options) =>
        options
        .setName('word')
        .setDescription('Separate words or phrases you want to block with a comma (dog, cat, tiger)')
        .setRequired(true),
                      ),
                  ),
}