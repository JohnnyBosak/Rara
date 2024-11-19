const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const iconMapping = {
    '01d': '☀️',
    '01n': '🌑',
    '02d': '🌤️',
    '02n': '<:few_clouds_night:1209610160729882654>',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '<:rain_night:1209608975524569168>',
    '11d': '🌩️',
    '11n': '🌩️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '<:mist:1209600399657410600>',
    '50n': '<:mist:1209600399657410600>',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Fetch the current time for a specific location')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The location to fetch the time for')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        // Get the location from the user's input
        const location = options.getString('location');

        // Make a request to the OpenWeatherMap API to fetch time zone data
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=8f938f248f0b1433812964484951bd40&units=imperial`);

            // Extract time zone data from the API response
            const timeZone = response.data.timezone;
            const currentTime = new Date(Date.now() + timeZone * 1000);

            // Get the corresponding new value for the icon
            const iconValue = response.data.weather[0].icon;
            const newIconValue = iconMapping[iconValue] || iconValue;
            
            // Format the time for display
            const formattedTime = currentTime.toLocaleTimeString(undefined, {
                timeZone: 'UTC',
                timeZoneName: 'short',
                hour12: false,
            });

            // Reply to the interaction with the fetched time
            await interaction.reply(`The current time in **${location}** is \`${formattedTime}\` ⏲\r**Weather** feels like \`${response.data.main.feels_like}°F/${((response.data.main.feels_like - 32) * 5 / 9).toFixed(1)}°C\`. ${response.data.weather[0].description.charAt(0).toUpperCase() + response.data.weather[0].description.slice(1)} ${newIconValue}`);
        } catch (error) {
            if (error.code == 404) {
                await interaction.reply(error.response.data.message);
            } else {
            console.error(error);
            await interaction.reply('An error occurred while fetching the time. Please try again later.');
            }
        }
    },
};