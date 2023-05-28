const { ChatInputCommandInteraction, codeBlock } = require("discord.js");
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

module.exports = {
  subCommand: "gpt.question",
  /** 
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    interaction.deferReply({
      content: 'Please wait while your question is being processed!'
    });

    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003', // Most powerful model so far
        prompt: interaction.options.getString('q-content'),
        max_tokens: 2048, // 2048 because that's the maximum amount of characters in Discord
        temperature: 0.5
      });

      interaction.followUp({
        content: codeBlock(response.data.choices[0].text)
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
