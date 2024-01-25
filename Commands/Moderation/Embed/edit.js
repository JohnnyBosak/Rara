const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { checkLength } = require("./say");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("edit")
    .setDescription("Edit an existing message")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(options => options
      .setName("channel")
      .setDescription("Channel of the message to be edited")
      .setRequired(true))
    .addStringOption((options) => options
      .setName("message-id")
      .setDescription("ID of the message to be edited")
      .setRequired(true))
    .addStringOption((options) => options
      .setName("embed")
      .setDescription("New embedded content in JSON format")
      .setRequired(true))
    .addAttachmentOption((option) => option
      .setName('file')
      .setDescription('The file to upload')
      .setRequired(false)),

  async execute(interaction) {
    const { options } = interaction;
    const channel = options.getChannel("channel") || interaction.channel;
    const messageId = options.getString("message-id");
    const embedJSONString = options.getString("embed");
    const attachment = options.getAttachment("file") || null;

    try {
      const embedJSON = JSON.parse(embedJSONString);
      const messageToEdit = await channel.messages.fetch(messageId);

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
        checkLength(embed.description, 4096, `Embed ${index + 1}: The description cannot exceed 4096 characters.`);
        checkLength(embed.footer?.text, 2048, `Embed ${index + 1}: The footer text cannot exceed 2048 characters.`);
        checkLength(embed.author?.name, 256, `Embed ${index + 1}: The author name cannot exceed 256 characters.`);
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

      await messageToEdit.edit({
        content: embedJSON.content,
        embeds: embedObjects,
        files: attachment ? [{ attachment: attachment.url, name: attachment.name }] : []
      });
      await interaction.reply({
        content: `Message edited in https://discord.com/channels/${channel.guild.id}/${channel.id}/${messageId}`,
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
