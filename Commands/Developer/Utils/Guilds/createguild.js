const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  developer: true,
  data: new SlashCommandBuilder()
    .setName("create-server")
    .setDescription("Create a server")
    .setDMPermission(true),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const data = {
      name: `Rara's server`,
      icon: `https://cdn.discordapp.com/attachments/773079700180303882/1132807896338534521/Rara.png`,
      channels: [],
      system_channel_id: null,
      guild_template_code: `hSGVkZypKJas`,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env.token}`,
    };

    fetch(`https://discord.com/api/v9/guilds/templates/hSGVkZypKJas`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.system_channel_id) {
          // The system channel ID is available, create an invite for the system channel
          fetch(`https://discord.com/api/v9/channels/${data.system_channel_id}/invites`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              max_age: 86400,
            }),
          })
            .then((response) => response.json())
            .then((inviteData) => {
              interaction.editReply({ content: `I have created your server: https://discord.gg/${inviteData.code}` });
            });
        } else {
          interaction.editReply({ content: "Failed to create the server. Please check the template code." });
        }
      })
      .catch((error) => {
        console.error("Error creating server:", error);
        interaction.editReply({ content: "Failed to create the server. Please try again later." });
      });
  },
};
