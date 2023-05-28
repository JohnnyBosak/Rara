const { ChatInputCommandInteraction } = require("discord.js");
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

module.exports = {
  subCommand: "gpt.image",
  /** 
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      await interaction.deferReply({
        content: 'Please wait while your image is being generated!'
      });

      const response = await openai.createImage({
        prompt: interaction.options.getString('i-content'),
        n: 1, // Amount of images to send
        size: '1024x1024', // 256x256 or 512x512 or 1024x1024
      });

      interaction.followUp({
        content: response.data.data[0].url
      });
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'UND_ERR_ABORTED') {
        interaction.followUp({
          content: 'Request aborted! Please try again later!'
        });
      } else {
        interaction.followUp({
          content: 'An error occurred! Please try again later!'
        });
      }
    }
  }
}
