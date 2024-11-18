# Rara Discord Bot

## Description
Rara is an 18-year-old pure-blooded devil, known as the "Crimson-Haired Ruin Princess" and other nicknames. This Discord bot is designed to bring Rara's personality to life, providing various features and commands to enhance your Discord server experience.

## Features
- **Music Playback**: Play music from Spotify, SoundCloud, and YouTube.
- **Giveaways**: Manage and run giveaways in your server.
- **AI Integration**: Interact with AI-powered features.
- **Moderation**: Tools to help moderate your server.
- **Fun Commands**: Various fun commands to entertain your server members.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/JohnnyBosak/Rara.git
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```

## Configuration
1. Create a `.env` file in the root directory and add your environment variables as shown below:

    ```env
    spotifySecret="your_spotify_secret" # Spotify Secret Key
    spotifyClientID="your_spotify_client_id" # Spotify Client ID
    database="your_mongodb_connection_string" # MongoDB database connection string
    tenorAPI="your_tenor_api_key" # Tenor API Key
    X_RapidAPI_Key="your_rapidapi_key" # X-RapidAPI Key
    OPENAI_API_KEY="your_openai_api_key" # OpenAI API Key
    themvoiedbapi="your_themoviedb_api_key" # The Movie Database API Key
    token="your_token" # Bot Token
    wallhaven_api="your_wallhaven_api_key" # Wallhaven API Key
    Secure_1PSID="your_secure_1psid" # Secure 1PSID
    server_template_code="your_server_template_code" # Server Template Code used by the bot to create a new server
    rsnai="your_rsnai"
    virus_total="your_virus_total_api_key" # Virus Total API Key
    unsplashAccessKey="your_unsplash_access_key" # Unsplash Access Key
    ```

## Usage
1. Start the bot:
    ```bash
    npm start
    ```

## Commands
Use the `/help` command to see and check all bot commands.

### Developer Commands
- `/load_dm` - Generate a transcript of a direct message conversation
- `/reload` - Reload your events/commands
- `/emit` - Emit the guildMemberJoin/Left events
- `/guild` - List/create/delete servers
- `/database` - Replit database settings
- `/avatar` - Change Rara avatar

Check the `Commands` folder to see more details about these developer commands.

## Contributing
Feel free to submit issues and pull requests. Contributions are welcome!

## License
This project is licensed under the MIT License.