# Why do I have all these packages?
I have quite a few packages; I felt like I should explain them and why they're here.

## Dependencies
* @discordjs/uws - Much faster websocket connection
* aki-api - Akinator API access - For [akinator command](src/commands/Fun/akinator.js)
* bufferutil - Much faster websocket connection
* chalk - Console coloring
* cheerio - JQuery for Node.js - For [webtoon command](src/commands/Comics/webtoon.js)
* command-line-args - Flags and options used by the console, for example:
`node index.js -d # Debug mode`
`node index.js -v # Verbose mode`
`node index.js --ciMode # Bypasses startup script, instead uses ci script.`
... etc
* compressing - Compresses log folders to save space on the disk
* convert-units - Converts *many* units from one to another - For [convert command](src/commands/Misc/convert.js)
* **discord.js - Connects to Discord API** If I could have only one package this would be it.
* dotenv - .env file support, also used in conjunction with command-line-args
* enmap - Used for various mappings, like commands, folders, aliases, etc.
* erlpack - Significantly faster WebSocket data (de)serialisation
* ffmpeg-static - Music support
* fs-extra - Promise based fs, plus support for deleting directories which is what I was going for anyway
* giphy-api - Giphy API access - For [kiss command](src/commands/Fun/kiss.js)
* google-it - Google API access.. i think? - For [google command](src/commands/Misc/google.js)
* moment / moment-duration-format - Timestamp formatting
* node-fetch - Alternative to snekfetch - For [wolfram command](src/commands/Misc/wolfram.js)
* parse-duration - For converting times into milliseconds, mainly used in the Moderation/temp(etc) commands
* sequelize - ORM used for handling *all* database queries on this bot
* simple-youtube-api - For Music module, pulls information on the youtube video provided by user
* sodium - Faster voice packet encryption and decryption
* sqlite3 - Required for sequelize package
* walk - Finds files inside directories, and loads them. Used in the [index file](src/index.js)
* ws - Used for the failover websocket
* ytdl-core-discord - Alternative to ytdl-core, optimized specifically for discord.js, voice backend
* zlib-sync - for Websocket data compression and inflation

## devDependencies
* eslint - Code cleaning
* terminal-kit - Used for terminal module, provides various shortcuts for readline node package
* pm2 - Process manager, used mainly in production