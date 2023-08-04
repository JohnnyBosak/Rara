const { SlashCommandBuilder } = require("discord.js");
const superagent = require("superagent");
const onlyEmoji = require("emoji-aware").onlyEmoji;
const sharp = require("sharp");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emoji-mixer")
    .setDescription("Combine two different emojis")
    .setDMPermission(false)
    .addStringOption(options => options
      .setName("emojis")
      .setDescription("The emoji to combine")
      .setRequired(true)
    )
    .addStringOption(options => options
      .setName("size")
      .setDescription("Emoji dimension")
      .setRequired(false)
      .addChoices({ name: 'Emote', value: '64' },
                  { name: 'Large emote', value: '128' },
                  { name: 'Sticker', value: '320' },
                  { name: 'Image (default)', value: '534' })
    ),

  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: false
    });

    const { options } = interaction;
    const eString = options.getString('emojis');
    const size = options.getString('size') || '534';

    if (!eString || !onlyEmoji(eString).length) {
      return await interaction.editReply({
        content: "⚠ Please provide valid emojis to combine.",
      });
    }

    const input = onlyEmoji(eString);
    const response = `⚠ One or both of the emojis (\`${eString}\`) are not supported. Keep in mind that gestures (e.g., thumbsup) and custom server emojis are not supported.`;

    const output = await superagent.get("https://tenor.googleapis.com/v2/featured")
      .query({
        key: process.env.tenorAPI,
        contentfilter: "high",
        media_filter: "png_transparent",
        component: "proactive",
        collection: "emoji_kitchen_v5",
        q: input.join("_")
      })
      .catch(err => {
        console.error("Error fetching emojis:", err);
        return null;
      });

    if (!output || !output.body.results[0]) {
      return await interaction.editReply({
        content: response
      });
    } else if (eString.startsWith("<") || eString.endsWith(">")) {
      return await interaction.editReply({
        content: response
      });
    }

    const imageResponse = await superagent.get(output.body.results[0].url).responseType('blob');

    const resizedImageBuffer = await sharp(imageResponse.body)
      .resize({
        width: Number(size),
        height: Number(size)
      })
      .toBuffer();

    await interaction.editReply({
      files: [{
        attachment: resizedImageBuffer,
        name: "combined_emoji.png"
      }]
    });
  }
};
