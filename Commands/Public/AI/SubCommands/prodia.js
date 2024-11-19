const { ChatInputCommandInteraction } = require("discord.js");
const { RsnChat } = require("rsnchat");

const rsnchat = new RsnChat(process.env.rsnai);

module.exports = {
  subCommand: "ai.prodia",

  /** 
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    try {
      await interaction.deferReply();

      const prompt = interaction.options.getString('prompt');
      const negativePrompt = interaction.options.getString('negative_prompt') || "blury";
      const model = interaction.options.getString('model') || "absolutereality_v181.safetensors [3d9d4d2b]";

      const responseProdia = await rsnchat.prodia(prompt, negativePrompt, model);
      const response = responseProdia.imageUrl;

      if (response !== null) {
        console.log(response);
        await interaction.editReply({
          files: [{ attachment: response }],
        });
      } else {
        console.log(response);
        await interaction.editReply("Unable to generate a response.");
      }
        
    } catch (error) {
      console.error(error);
      await interaction.editReply("An error occurred while processing the request. Please try again later.");
    }
  },
};