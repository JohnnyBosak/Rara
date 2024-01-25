const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

function checkLength(value, maxLength, errorMessage) {
  if (value && value.length > maxLength) {
    throw new Error(errorMessage);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say_json")
    .setDescription("Send an embed message using JSON data")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((options) => options
      .setName("embed")
      .setDescription("Embed JSON data")
      .setRequired(true))
    .addChannelOption((options) => options
      .setName("channel")
      .setDescription("The channel in which to send the message")
      .setRequired(false))
    .addAttachmentOption((option) => option
      .setName('file')
      .setDescription('The file to upload')
      .setRequired(false))
    .addBooleanOption((option) => option
      .setName('suppress_notifications')
      .setDescription('Prevent notifications when mentions are present in the message content.')
      .setRequired(false)
    ),
  checkLength,

  async execute(interaction) {
    const { options } = interaction;
    const embedJSONString = options.getString("embed");
    const channel = options.getChannel("channel") || interaction.channel;
    const attachment = options.getAttachment("file") || null;
    const suppress = options.getBoolean("suppress_notifications") || false;

    try {
      const embedJSON = JSON.parse(embedJSONString);

      if (embedJSON.embeds?.length > 10) {
        throw new Error("You cannot send more than 10 embeds in a single message.");
      }
      if (embedJSON.content?.length > 2000) {
        throw new Error("Content cannot exceed maximum length of 2000.");
      }
      if (attachment && attachment.size > 25 * 1024 * 1024) {
        throw new Error("Attachment size cannot exceed 25MB.");
      }

      embedJSON.embeds?.forEach((embed, index) => {
        checkLength(embed.title, 256, `Embed ${index + 1}: The title cannot exceed 256 characters.`);
        checkLength(embed.description, 4096, `Embed ${index + 1}: The description exceed 4096 characters.`);
        checkLength(embed.footer?.text, 2048, `Embed ${index + 1}: The footer text exceed 2048 characters.`);
        checkLength(embed.author?.name, 256, `Embed ${index + 1}: The author name exceed 256 characters.`);
        checkLength(embed.fields, 25, `Embed ${index + 1}: The embed cannot have more than 25 fields.`);
      });

      const embeds = embedJSON.embeds || [];
      const embedObjects = embeds.map((embed) => ({
        color: embed.color || null,
        title: embed.title || null,
        url: embed.url || null,
        author: {
          name: embed.author?.name || null,
          icon_url: embed.author?.icon_url || null,
          url: embed.author?.url || null,
        },
        description: embed.description || null,
        thumbnail: {
          url: embed.thumbnail?.url || null,
        },
        fields: embed.fields || [],
        image: {
          url: embed.image?.url || null,
        },
        timestamp: embed.timestamp ? new Date(embed.timestamp).toISOString() : null,
        footer: {
          text: embed.footer?.text || null,
          icon_url: embed.footer?.icon_url || null,
        },
      }));

      const sentMessage = await channel.send({
        content: embedJSON.content,
        allowedMentions: suppress ? { parse: [] } : null,
        embeds: embedObjects,
        files: attachment ? [{ attachment: attachment.url, name: attachment.name }] : []
      });

      await interaction.reply({
        content: `Message sent to https://discord.com/channels/${channel.guild.id}/${channel.id}/${sentMessage.id}`,
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `An error occurred:\n${error.message}`,
        ephemeral: true
      });
    }
  }
};
