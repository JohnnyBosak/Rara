const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

function safeJSONParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        return null;
    }
}

function checkLength(value, maxLength, errorMessage) {
  if (value && value.length > maxLength) {
    throw new Error(errorMessage);
  }
}

function checkEmbed(embed, index) {
  checkLength(embed.title, 256, `Embed ${index + 1}: The title cannot exceed 256 characters.`);
  checkLength(embed.description, 4096, `Embed ${index + 1}: The description exceed 4096 characters.`);
  checkLength(embed.footer?.text, 2048, `Embed ${index + 1}: The footer text exceed 2048 characters.`);
  checkLength(embed.author?.name, 256, `Embed ${index + 1}: The author name exceed 256 characters.`);

  // Check each field in the embed
  embed.fields?.forEach((field, fieldIndex) => {
    checkLength(field.name, 256, `Embed ${index + 1}, Field ${fieldIndex + 1}: The field name cannot exceed 256 characters.`);
    checkLength(field.value, 1024, `Embed ${index + 1}, Field ${fieldIndex + 1}: The field value exceed 1024 characters.`);
  });

  checkLength(embed.fields, 25, `Embed ${index + 1}: The embed cannot have more than 25 fields.`);
}

function hexToDecimal(hexColor) {
  hexColor = hexColor.replace(/^#/, '');
  const decimalColor = parseInt(hexColor, 16);
  return decimalColor;
}

function createEmbedObjects(embeds) {
  return embeds?.map((embed) => {
    if (embed.color) {
      const isHexColor = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(embed.color);
      embed.color = isHexColor ? hexToDecimal(embed.color) : embed.color;
    }

    return {
      color: embed.color || null,
      title: embed.title || null,
      url: embed.url || null,
      author: embed.author,
      description: embed.description || null,
      thumbnail: { url: embed.thumbnail?.url || embed.thumbnail || null },
      fields: embed.fields || [],
      image: { url: embed.image?.url || embed.image || null },
      timestamp: embed.timestamp ? new Date(embed.timestamp).toISOString() : null,
      footer: embed.footer,
    };
  }) || [];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say_json")
    .setDescription("Send an embed message using JSON data")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((options) => options
      .setName("message")
      .setDescription("Message to send (use https://eb.nadeko.bot/ for embed JSON data)")
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
      .setName('mentions_notification')
      .setDescription('Prevent notifications when mentions are present in the message content.')
      .setRequired(false)
    ),
  safeJSONParse,
  checkLength,
  checkEmbed,
  hexToDecimal,
  createEmbedObjects,

  async execute(interaction) {
    const { options } = interaction;
    const embedJSONString = options.getString("message");
    const channel = options.getChannel("channel") || interaction.channel;
    const attachment = options.getAttachment("file") || null;
    const suppress = options.getBoolean("mentions_notification", false);
      
      try {
    if (attachment?.size > 25 * 1024 * 1024) {
      throw new Error("Attachment size cannot exceed 25 MB.");
    }

    let contentToSend = {
      allowedMentions: suppress ? { parse: [] } : null,
      files: attachment ? [{ attachment: attachment.url, name: attachment.name }] : []
    };

      const embedJSON = safeJSONParse(embedJSONString);
      
      if (embedJSON === null || typeof embedJSON === 'number') {
          checkLength(embedJSONString, 2000, `Message cannot exceed 2000 characters.`);
          const sentMessage = await channel.send({ ...contentToSend, content: embedJSONString });
          await interaction.reply({
              content: `Message sent to ${sentMessage.url}\nYou can use https://eb.nadeko.bot/ to send additional embed messages.`,
              ephemeral: true
          });
          return;
      }
      
    checkLength(embedJSON.content, 2000, `Content cannot exceed 2000 characters.`);
    
     if (embedJSON.content && !embedJSON.embeds) {
        const sentMessage = await channel.send({ ...contentToSend, content: embedJSON.content });
        await interaction.reply({
          content: `Message sent to ${sentMessage.url}\nYou can use https://eb.nadeko.bot/ to send additional embed messages.`,
          ephemeral: true
        });
        return;
      }
    
      checkLength(embedJSON.embeds, 10, `You cannot send more than 10 embeds in a single message.`);

      embedJSON.embeds?.forEach((embed, index) => {
          checkEmbed(embed, index);
      });

      const embedObjects = createEmbedObjects(embedJSON.embeds);

      const sentMessage = await channel.send({...contentToSend,
        content: embedJSON.content || null,
        embeds: embedObjects,
      });

      await interaction.reply({
        content: `Message sent to ${sentMessage.url}`,
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
