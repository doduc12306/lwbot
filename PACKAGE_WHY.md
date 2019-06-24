# Why do I have all these packages?
I have quite a few packages; I felt like I should explain them and why they're here.

## Dependencies
* @discordjs/uws - Much faster websocket connection
* aki-api - Akinator API access - For [akinator command](src/commands/Fun/akinator.js)
* chalk - Console coloring
* command-line-args - Flags and options used by the console, for example:
`node index.js -d # Debug mode`
`node index.js -v # Verbose mode`
`node index.js --ciMode # Bypasses startup script, instead uses ci script.`
... etc
* convert-units - Converts *many* units from one to another - For [convert command](src/commands/Misc/convert.js)
* **discord.js - Main library used to do everything here.** If I could have only one package this would be it.
* dotenv - .env file support, also used in conjunction with command-line-args
* enmap - Used for various mappings, like commands, folders, aliases, etc.
* erlpack - Significantly faster WebSocket data (de)serialisation
* ffmpeg-binaries - Music support
* giphy-api - Giphy API access - For [kiss command](src/commands/Fun/kiss.js)
* moment / moment-duration-format - Timestamp formatting
* node-fetch - Alternative to snekfetch - For [wolfram command](src/commands/Misc/wolfram.js)
* node-opus - Music support
* parse-duration - For converting times into milliseconds, mainly used in the Moderation/temp(etc) commands
* puppeteer - Headless browser. Really neat. For [search command](src/commands/Webtoons/search.js)
* sequelize - ORM used for handling *all* database queries on this bot
* simple-youtube-api - For Music module, pulls information on the youtube video provided by user
* sodium - Faster voice packet encryption and decryption
* sqlite3 - Required for sequelize package
* walk - Finds files inside directories, and loads them. Used in the [index file](src/index.js)
* ytdl-core-discord - Alternative to ytdl-core, optimized specifically for discord.js, voice backend

## devDependencies
* eslint - Code cleaning
* terminal-kit - Used for terminal module, provides various shortcuts for readline node package
* pm2 - Process manager, used mainly in production