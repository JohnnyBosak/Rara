const { SlashCommandBuilder, MessageActionRow, MessageButton, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const { ActionRowBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('movie')
    .setDescription('Gets information about a movie, rating, description and much more')
    .setDMPermission(false)
    .addStringOption(option => option
      .setName('name')
      .setDescription('The name of the movie')
      .setRequired(true)),

  async execute(interaction) {
    const themvoiedbapi = process.env.themvoiedbapi;

    const { options, member, guild } = interaction;
    const name = options.getString("name");
    const apiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${themvoiedbapi}&query=${encodeURIComponent(name)}`;
    const response = await axios.get(apiUrl);

    const movie = response.data.results[0];

    if (movie) {
      const starRating = generateStarRating(movie.vote_average);

      const url = `https://www.themoviedb.org/${movie.media_type}/${movie.id}`
      const release_date = movie.release_date || movie.first_air_date;

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('View on TMDB')
            .setStyle(ButtonStyle.Link)
            .setURL(url)
        );

      const embed = new EmbedBuilder()
        .setAuthor({ name: "Movie Command", iconURL: guild.iconURL({ size: 2048 }) })
        .setTitle(movie.title || movie.name)
        .setURL(`https://www.themoviedb.org/${movie.media_type}/${movie.id}`)
        .setImage(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
        .addFields(
          { name: "Release Date", value: `**${release_date}**`},
          { name: "Overview (Description)", value: `**${movie.overview}**` },
          { name: "Popular! <:fire:1172622913212514375>", value: `**${movie.popularity}**` },
          { name: `Language <:language:1172623212039905280>`, value: `**${movie.original_language}**` },
          { name: "Average Vote", value: `**${starRating}**` },
          { name: "**Age Rating**", value: `Adult - ${movie.adult}` })
        .setFooter({ text: "Search Movie", iconURL: member.displayAvatarURL() })
        .setColor('#f3ce13')
        .setTimestamp();

      try {
        // Reply to the interaction with the embed and button
        await interaction.reply({ embeds: [embed], components: [row] });
      } catch (err) {
        console.error(`Error replying to interaction: ${err}`);
      }
    } else {
      try {
        // Reply to the interaction if the movie doesn't exist
        await interaction.reply({ content: "A movie with that title doesn't exist. Make sure you've got the correct title :)", ephemeral: true });
      } catch (err) {
        console.error(`Error replying to interaction: ${err}`);
      }
    }
  },
};

function generateStarRating(voteAverage) {
  const maxStars = 10;
  const starCount = Math.floor((voteAverage / 10) * maxStars);
  const fullStars = '<:star:1172622098481553530>'.repeat(starCount);
  const halfStar = ((voteAverage % 10) >= 5 && starCount < maxStars) ? '<:HalfStar:1172622082874560674>' : '';
  const emptyStarsCount = maxStars - starCount - (halfStar.length ? 1 : 0);
  const emptyStars = ''.repeat(emptyStarsCount);

  return `${fullStars}${halfStar}${emptyStars} (${voteAverage}/10)`;
}
