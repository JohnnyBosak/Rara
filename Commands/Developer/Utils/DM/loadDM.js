const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("load_dm")
    .setDescription("Generate a transcript of a direct message conversation")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((options) => options
      .setName("user_id")
      .setDescription("The user ID of the conversation to generate a transcript for")
      .setRequired(true)
    )
    .addNumberOption((options) =>
      options
        .setName("number_of_messages")
        .setDescription("The number of messages to load (default is 100)")
        .setRequired(false) // Optional field
    ),

  async execute(interaction) {
    const userId = interaction.options.getString("user_id");

    try {
      await interaction.deferReply({ ephemeral: true });

      const dmChannel = await interaction.client.users.fetch(userId).then(user => user.createDM());
      const numberOfMessages = interaction.options.getNumber("number_of_messages") || 100; // Default to 100 if not provided
      
      const attachment = await discordTranscripts.createTranscript(dmChannel, {
        limit: numberOfMessages, // Max amount of messages to fetch
        returnType: 'attachment', // Return as an attachment
        filename: 'transcript.html', // File name of the transcript
        saveImages: true, // Do not save image data in HTML
        footerText: "Exported {number} message{s}", // Footer text format
        poweredBy: false, // Include powered by footer
        ssr: true // Enable server-side rendering for hydration
      });

      await interaction.editReply({
        files: [attachment],
      });

    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `An error occurred: ${error.message}`,
      });
    }
  },
};