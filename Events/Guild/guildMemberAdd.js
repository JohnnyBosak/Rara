const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const moment = require("moment");
const memberLogDatabase = require("../../Schemas/MemberLog");

// Constants and configuration
const RISK_LEVELS = [
  { threshold: moment().subtract(2, "days").unix(), color: "#e21e1e", label: "Extreme" },
  { threshold: moment().subtract(2, "weeks").unix(), color: "#e24d1e", label: "High" },
  { threshold: moment().subtract(2, "months").unix(), color: "#e2bb1e", label: "Medium" },
  { threshold: 0, color: "#74e21e", label: "Fairly safe" },
];

// Utility function to draw a rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
  ctx.fill();
}

// Utility function to get random welcome message
function getRandomWelcomeMessage(member) {
  const welcomeMessage = [
    `${member.user} just slid into the server.`,
    `${member.user} just showed up!`,
    `${member.user} just landed.`,
    `${member.user} joined the party.`,
    `${member.user} hopped into the server.`,
    `${member.user} is here.`,
    `Welcome, ${member.user}. We hope you've brought pizza.`,
    `Welcome, ${member.user}. Say hi!`,
    `Welcome, ${member.user}.`,
    `Everyone welcome ${member.user}!`,
    `Glad you're here, ${member.user}.`,
    `Yay you made it, ${member.user}!`,
    `Good to see you, ${member.user}.`,
    `A wild ${member.user} appeared.`
  ];

  const randomWelcomeMessage = welcomeMessage[Math.floor(Math.random() * welcomeMessage.length)];
  return randomWelcomeMessage; // Return the selected welcome message
}

// Utility function to get risk level
function getRiskLevel(accountCreation) {
  for (const riskLevel of RISK_LEVELS) {
    if (accountCreation >= riskLevel.threshold) {
      return riskLevel;
    }
  }
  return RISK_LEVELS[RISK_LEVELS.length - 1]; // Default to the lowest risk level
}

module.exports = {
  name: "guildMemberAdd",

  async execute(member) {
    try {
      const guildConfig = await memberLogDatabase.findOne({
        Guild: member.guild.id
      });
      if (!guildConfig) return;

      const guildRoles = member.guild.roles.cache;
      let assignedRole = member.user.bot ? guildRoles.get(guildConfig.botRole) : guildRoles.get(guildConfig.memberRole);

      if (!assignedRole) {
        assignedRole = "Not configured.";
      } else {
        await member.roles.add(assignedRole);
      }

      const logChannel = guildConfig ? member.guild.channels.cache.get(guildConfig.logChannel) : null;
      const welcomeChannel = guildConfig ? member.guild.channels.cache.get(guildConfig.welcomeChannel) : null;

      const accountCreation = parseInt(member.user.createdTimestamp / 1000);
      const joiningTime = parseInt(member.joinedAt / 1000);

      const riskLevel = getRiskLevel(parseInt(member.user.createdTimestamp / 1000));

      if (welcomeChannel) {
        const attachment = await createWelcomeImage(member);
        const randomWelcomeMessage = getRandomWelcomeMessage(member);
        welcomeChannel.send({
          content: "## " + randomWelcomeMessage,
          allowedMentions: { parse: [] },
          files: [attachment]
        });
      }

      if (logChannel) {
        await sendLogEmbed(member, riskLevel, assignedRole, accountCreation, joiningTime, logChannel);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  },
};

async function createWelcomeImage(member) {
  const welcomeCanvas = {};
  welcomeCanvas.create = Canvas.createCanvas(1024, 500);
  welcomeCanvas.context = welcomeCanvas.create.getContext("2d");
  welcomeCanvas.context.font = "72px sans-serif";
  welcomeCanvas.context.fillStyle = "#ffffff";

  const background = member.guild.bannerURL() || "https://source.unsplash.com/random/?gaming";

  await Canvas.loadImage(background).then(async (img) => {
    welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500);

    // Set the fillStyle for welcome text to white
    welcomeCanvas.context.beginPath();
    welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
    welcomeCanvas.context.stroke();
    welcomeCanvas.context.fill();
  });

  // Draw a rounded rectangle with transparent black fill
  welcomeCanvas.context.fillStyle = "rgba(0, 0, 0, 0.7)"; // Transparent black with increased transparency
  drawRoundedRect(welcomeCanvas.context, 260, 307, 500, 170, 20); // Calling the custom function
  welcomeCanvas.context.fillStyle = "#ffffff";
  welcomeCanvas.context.fillText("Welcome", 360, 370);

  let canvas = welcomeCanvas;
  canvas.context.font = "42px sans-serif";
  canvas.context.textAlign = "center";

  // Set the fillStyle for member tag text to white
  canvas.context.fillStyle = "#ffffff";
  canvas.context.fillText(member.user.tag.toUpperCase().replace("#0", ""), 512, 420);

  // Adjust member count text to fit better
  const memberCountText = `Member #${member.guild.memberCount}`;
  canvas.context.font = "28px sans-serif";

  // Set the fillStyle for member count text to white
  canvas.context.fillStyle = "#ffffff";
  canvas.context.fillText(memberCountText, 512, 465);

  canvas.context.beginPath();
  canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true);
  canvas.context.closePath();
  canvas.context.clip();
  await Canvas.loadImage(member.user.displayAvatarURL({ extension: "jpg", size: 1024 })).then((img) => {
    canvas.context.drawImage(img, 393, 47, 238, 238);
  });

  const attachment = new AttachmentBuilder(await canvas.create.toBuffer(), {
    name: "welcome.png",
  });

  process.noDeprecation = true;
  return attachment;
}

async function sendLogEmbed(member, riskLevel, assignedRole, accountCreation, joiningTime, logChannel) {
  const Embed = new EmbedBuilder()
    .setAuthor({
      name: `${member.user.tag} | ${member.id}`,
      iconURL: member.displayAvatarURL({
        dynamic: true
      })
    })
    .setColor(riskLevel.color)
    .setThumbnail(member.user.displayAvatarURL({
      dynamic: true,
      size: 256
    }))
    .setDescription([
      `• User: ${member.user}`,
      `• Account Type: ${member.user.bot ? "bot" : "User"}`,
      `• Role Assigned: ${assignedRole}`,
      `• Risk Level: ${riskLevel.label}\n`,
      `• Account Created: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
      `• Account Joined: <t:${joiningTime}:D> | <t:${joiningTime}:R>`
    ].join("\n"))
    .setFooter({
      text: "Joined"
    })
    .setTimestamp();

  if (riskLevel.label === "Extreme" || riskLevel.label === "High") {
    const Buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`MemberLogging-Kick-${member.id}`)
          .setLabel("Kick")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`MemberLogging-Ban-${member.id}`)
          .setLabel("Ban")
          .setStyle(ButtonStyle.Danger)
      );

    await logChannel.send({
      embeds: [Embed],
      components: [Buttons],
    });
  } else {
    await logChannel.send({
      embeds: [Embed],
    });
  }
}
