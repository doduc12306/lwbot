# Changelog

## v1.6.1 [5/1/2020]
Hot fix because perm levels weren't working correctly. Also has a few other bug fixes.

### Commands
* Music/play: Reduced fee from 1000 Cubits to 100 Cubits
* Server/trainnetwork: Commented out some stuff till the library devs fix their bug. Command *still* disabled.
* System/eval: Remove puppeteer-core require
* System/sudo: Now uses `message.functions.parseUser(args[0])` to get user. This allows for mentions/IDs
* System/permlvel -> User/permlevel

### Backend
* config
  * defaultSettings.capsWarnEnabled: now disabled by default
  * defaultSettings.xpLevelUpEnabled: now disabled by default
  * Fixed some permission level parsing. Forgot to add in the .cache when accessing role managers. This affected the ability for the bot to find if a user had a role, and thusly set their permission level
  * Added level 6 & 7 permission level placeholders
* dbFunctions/client/misc: client.permlevel: Removed a line that was causing issues
* dbFunctions/message/misc: Fixed message.functions.parseUser() user finding. Again, forgot cache. Also added in Class instanceof checking
* Events: message: Re-emits a message instead of telling the user to rerun the command if a table hasn't been created yet.

### Misc
* Changed some wording in the docs settings
* Changed name of currency: Kowoks -> Cubits

## v1.6.0 [4/29/2020]
Woo first release of the year! Only four months in lol<br>
In total there were 172 commits, not including this one.

### Commands
* **A bunch of commands got updates from discord.js v11 to v12. If that's the only change, it's not listed here.**
* Comics/webtoon: Changed from puppeteer to cheerio/node-fetch. Much better than spinning up a whole new chromium process lol
* Comics/xkcd: Fixed the NaN bug, fixed json.num bug, etc
* Economy/eco: Fixed some bugs, made it prettier
* Economy/getbal: Fixed some bugs, made it prettier
* Fun/akinator: Completely rewrote the command
* Fun/ascii: Disabled this command because it unnecessarily requires a c++ package that I cannot build for some reason
* Fun/cowsay: Added disable reason: This literally made a call to my machine's cowsay command. As there is no safe way to sanitize input like this, the command is disabled until I can find a suitable package replacement
* Deleted Fun/kiss command
* Fun/slots: worked on this a bit more. Still not enabled, but closer to being done.
* Fun/sparkle: Not sure what changed here but apparently something did so I'm including it in this changelog. Let's just say bug fixes.
* Fun/urban: Moved from snekfetch to node-fetch
* Added google command
* Moderation commands: discord.js v12 changes, wording changes (user/member), added reasons for the audit logs
* Moderation/modlogs: Added the ability to start in the middle and scroll from there
* Moderation/purge: Can now purge more than 100 messages, but less than 500 for performance.
* Moderation/voicekick/voiceban: Used Discord's built-in disconnect feature instead of the move-user-to-channel-then-delete method
* Added Moderation/votekick command, and disabled it due to lack of willing testing participants.
* ***Disabled Music commands.*** For some odd reason, it now stops playing after a few songs and locks the entire thread. This is something I cannot for the life of me figure out how to fix, and D.js support is not helpful.
* Server/addemote: Added attachment support
* Server/announce: Removed no-subs and color arguments
* Server/guildinfo: Added some new fields: guild description, guild boost count, and features.
* Created *unfinished* Server/owomode command. 
* Created Serve/reset command: Will leave the server, and in the process remove the guild's database.. hence a "reset"
  * Only accessible to Bot Commander and up
* Created Server/trainnetwork command: This was supposed to be a way for guild owners to detect bad messages on their servers by way of a neural network. Unfortunately, it seems the network doesn't wanna train when I tell it to. Not only that but the package's README file provides an example that doesn't work. I dont know what to do, so I'm disabling it and it's associated backend child_process training file.
* System/diagnose: Added support for database enable/disable as well as reason as to why it's disabled if it is.
* System/help: Rewrote this command so it doesn't DM the user a wall of text. It's more now like Tatsumaki's help command.
* System/stats: Moved to os.uptime() instead of a call to the system's `uptime -p` which doesn't even work if you're not on linux.
* Created System/support command: Just redirects the user to the [support server](https://discord.gg/225Kyt5)
* Tags commands: Required tags directly instead of from the client object
* Created User/mood command: Allows the user to set their mood on their user profile
* User/userinfo: Added support for custom statuses.

### Backend
* index: Added help cli flag
* index: Stops the user if running the script as root. If the user really wants to run the bot as root, there's a new flag: `--forceRoot`. This will bypass the check-exit, and there's now a huge warning text that appears before the bot starts up.
* Moved settings from one big export to multiple class-related methods
* Removed Tags database from client object
* config: String keys to regular keys
* config: Added DJ perm level, for use with Music commands (which are currently disabled)
* Every database's transaction type is now immediate to crack down on locked databases
* Added events database: Adds mod_log support to some d.js events (currently no way to change data outside of eval command)
* events:
  * channelCreate: Guild events support
  * Created channelDelete: Guild events support
  * Created guildDelete: Will delete guild database and client.settings presence when the bot is removed from a guild
  * Created guildMemberSpeaking: A test to see if receiving voice data was possible. Now that it is, I'll eventually be adding in voice command support. Hopefully.
  * message:
    * Fixed a critical bug where the permlevel method was never actually called when checking to see if a command was disabled for the server
    * Added some cooldown messages
    * Checked to see if a command succeeded before adding user to the cooldown set
    * Fixed a bug where if a database's table hadn't yet been created, it would be created the next time a command was run. The bot also lets the user know of this.
    * Removed database cleanups from this file because sqWatchdog already handles it
  * Created messageDelete: Guild events support
  * messageUpdate: Guild events support
  * ready: Updated paths for failover websocket, delete some temporary keys from the client object
* If not running in debug mode, `process.env.NODE_ENV = 'production'`. Apparently this speeds some packages up by a bunch. Every millisecond counts.
* Event/command loading logging is now hidden in verbose mode.
* util/cleanperms -> util/prettyFlags: Added guild feature flags, added guild boost tiers
* sqWatchdog: Added events db cleanup, fixed XP v8 memory allocation bug,
* Removed GIPHY key from .env
* Packages:
  * `*` @discord.js/uws -> @discordjs/opus@0.2.1
  * `+` brain.js@2.0.0-alpha.12
  * `+` bufferutil@4.0.1
  * `+` chalk@4.0.0
  * `+` cheerio@1.0.0-rc.3
  * `*` compressing@1.4.0 -> 1.5.0
  * `*` discord.js@11.5.1 -> **12.1.1**
  * `*` enmap@5.2.0 -> 5.2.3
  * `*` ffmpeg-binaries -> ffmpeg-static@4.0.1
  * `*` fs-extra@8.1.0 -> 9.0.0
  * `+` google-it@1.4.1
  * `-` node-opus@0.3.2
  * `+` node-gyp@6.1.0
  * `*` parse-duration@0.1.1 -> 0.3.2
  * `-` puppeteer-core@1.20.0
  * `*` sequelize@5.19.5 -> 5.21.3
  * `*` sqlite3@4.0.9 -> 4.1.1
  * `+` utf-8-validate@5.0.2
  * `*` ws@7.1.2 -> 7.2.1
  * `+` zlib-sync@0.1.6

### Misc
* Updated copyright to include 2020
* Something about .eslintrc.json? Not sure what changed but it's showing up in the diff so it's here too.
* Ignored src/te?mp in .gitignore
* .gitlab-ci.yml: 
  * Set image to node:12.16.1
  * License scanning
  * Run findandedit.js before the ci suite
  * Moved script to npm test instead of in the ci file itself
* Added .yarnclean (i forget what this does but im too afraid to remove it)
* Added some docs so people aren't as confused anymore
* Removed terminal module
* Created util/findandedit.js: This manually edits lines of code in the ytdl-core directory to change the dependency path. Added as a postinstall script.

## v1.5.9 [10/24/2019]
### Commands
* Comics/webtoon: Added backwards compatibility in case users still type "featured" or "discovery"
* Fun/cowsay: Disabled while I find a way to not run cowasy directly on my rpi
* System/help: Newline for description if user doesnt have access
* System/power: Reboot now checks proper pm2 environment variable
* Tags: Consistent emoji scheme :pencil:
* Misc/avatar -> User/avatar
* Economy/rep -> User/rep
* Server/userinfo -> User/userinfo

### Backend
* **Failover websocket.** Process 1 is running. Process 2 connects to p1 via websocket. P2 detects p1 has gone offline via broken websocket connection. P2 starts clone of P1 with reduced features (planned!) and waits for p1 to come back. Once p1 comes back, p2 restarts and waits for p1 to go down again.
* Packages
  * `+` compressing@1.4.0 to compress log folders to save disk space
  * `*` enmap@5.1.0 -> 5.2.0
  * `+` fs-extra@8.1.0 to add some promises to fs, plus deleting whole folders; Bot-wide: fs -> fs-extra
  * `*` puppeteer-core@1.19.0 -> 1.20.0
  * `*` sequelize@5.12.1 -> 5.19.5
  * `+` ws for failover websocket communication
  * `*` eslint@6.1.0 -> 6.5.1
* dbFunctions
  * client
    * misc
      * Deleted client.inspect() because it was causing issues with console.log and such
    * user
      * index -> startup
      * whitespace changes
      * badges: actually shows where to update the row in the database
  * message
    * misc
      * owomode: check to make sure message is in a guild
      * owomode: remove owo'ing of things that have a url. This does not apply to field values.
      * owomode: replaceAll -> replace(/${letter}/g)
* Events
  * message
    * Remove the split for caps checking
    * Added some more ping-but-no-command responses
    * If there isn't a guild in the message, the permlevel is 0, regardless of bot config status.
  * ready
    * Failover websocket support
* src/failover: Process 2 source
* src/util/ws-failover-server: Process 1 failover websocket server source
* index.js -> startup.js, because the failover starts a process but via a module.export from index (startup, now)
* startup: Not-current-day log compression to save space
* Logger: Outputs if process is in failover mode too; +ws export
* sqWatchdog: Checks for a guild that doesn't have a database. If not, create one.
* Added "Playing **with da bois**" status

### Misc
* .env.default FAILOVER_WEBSOCKET_KEY key now exists for the failover websocket to authenticate with itself.
* .eslintrc: disabled no-empty, which was basically just eslint having a cow every time i left an if statement or for loop open
* Deleted .gitmodules
* Changed around the working for README.md
* Created /modules/README.md, just for some clarification of what's in there
* Renamed PACKAGE_WHY to packages
* Bot-wide: avatarURL -> displayAvatarURL because displayAvatarURL shows the default blue Clyde if the user hasnt set their avatar yet
* Bot-wide: client.verbose -> client.logger.verbose

## v1.5.7 [7/7/2019]
### Commands
* Webtoons/search -> Comics/webtoon: Renamed discover to canvas, while still keeping discover there for those that forget the update happened
* Added Comics/xkcd: Fetches an xkcd comic
* Economy/eco: Added support for the user profile class
* Economy/getbal: Added support for the user profile class and re-enabled the command
* Economy/rep: Bug fixes, and a cooldown of 1 day
* Fun/lenny: Hid the command
* Misc/avatar: avatarURL -> displayAvatarURL: Still displays if a user does not have an avatar.
* Deleted Misc/google
* Moderation/ban: Settings support
* Moderation/hackban: Settings support
* oh fuck it most of the moderation commands now have settings support. my fingers are getting tired
* Music: Settings & accent color support
* Music/queue: Redid the shuffle function, without using a whole extra library
* Server/announce: Bug fixes
* Server/commandconf: Edited passive agressive bot admin shaming
* Server/quote: Changed message jump from field to author
* System/set -> Server/set: Complete rewrite. It looks so much better now
* Server/userinfo: User profile class support
* System/eval: Added packages to require, added eval error handling
* System/info: Added thanks to my testers
* System/ping: Now just normal text instead of an embed.
* System/stats: Benchmarks now relies on a flag in the command instead of config.verboseMode
* Added System/sudo: Perform a command as another user
* Fun/akinator, Fun/urban, Moderation/case, Server/levels, Server/membercount, Server/role, Server/stafflist, System/help, System/invite, System/stats: Accent color support

### Backend
* Added accent color support as a server setting
* Created user profiles (as a class): a mood, badges, kowoks, and reputation
* Added user profile class
* message.send(): Dont error, just reject on empty message
* Added embed support for owoMode
* dbFunctions/message/settings: If guildID is a guild object, convert it into a guild id.
* Events/channelCreate: Removed permission syncing for categories. This overrode all per-channel permissions with the bot's own.
* Events/guildCreate: Replaced makeshift settings creation with the sqWatchdog's runner
* Events/message:
  * Redid settings retrieval. Now gets from the client.settings object, which is verified at ready event
  * Added mention prefixes, finally
  * Bot responds if prefix but no command
  * Accent color support
  * Randomized cooldown messages
  * Try/catch for command running
* Events/ready: Runs through sqWatchdog once before creating the interval
* index:
  * Removed sentry
  * Added `--noFileLog` argument, which doesn't output logs to a file
  * Exported the client for use in other files
  * Creates folders for the current day's logs
  * process.on('SIGINT') -> process.on('beforeExit')
* Logger: Every method now logs to a file.
* sqWatchdog: You can either do per-server or entire server/ database cleanups

### Misc
* Added CONTRIBUTING.md
* Added PACKAGE_WHY.md - Explains why I have all those packages
* modules/terminal: formatting.. at this point I might as well just not support it anymore. It's useless to me.
* Updated / added packages:
  * aki-api: 2.1.1 -> 3.1.1
  * Added @discordjs/uws v11.149.1
  * Added command-line-args v5.1.1
  * discord.js: 11.5.0 -> 11.5.1
  * dotenv: 7.0.0 -> 8.0.0
  * enmap: 4.8.1 -> 5.1.0
  * Added erlpack
  * Added ffmpeg-binaries v4.0.0
  * Removed google
  * Added node-opus v0.3.2
  * sequelize: 4.43.0 -> 5.12.1
  * simple-youtube-api: 5.1.1 -> 5.2.1
  * sqlite3: 4.0.6 -> 4.0.9
  * Replaced ytdl-core with ytdl-core-discord v1.0.3
* Package: added `build-node-opus` script for Debian-based systems
* Added Nen to Bot Support
* defaultSettings:
  * Added capsWarnEnabled
  * Added xpLevelUpEnabled
  * Added xpLevelUpMessage
  * Added accentColor
  * Added owoMode
* Statuses:
  * Added Playing with Gallium
  * Removed Playing with Chris McCoy @ Safely Endangered
  * Added Playing on a Raspberry Pi
  * Added Watching an unhealthy amount of anime
* Yarnpkg support

## v1.5.4 [6/13/2019]
### Commands
* Added Economy/rep command - Adds a reputation point to a user
* Added Misc/convert - Converts a unit to another unit
* Added Misc/wolfram - Polls data from the wolfram API. Currently limited to a few thousand queries per month
* Server/levels: Added in user level from db
* System/eval: Changed around some requires, got rid of hastebin posting because it was returning 503.. aka not my problem.
* System/help: Finds individual help from alias as well as normal command
* **Webtoons/search**: Searches a webtoon comic. This is what I've been trying to do since the beginning of this huge project.

### Events
* channelCreate: I think I fixed the spam-role-create bug.
* Added guildMemberUpdate but it's literally just to check if the owner is streaming, and to set the bot's own status as streaming to owner's stream url.
* message: Added cooldown support - cooldowns are assigned to the d.js User object.
* ready: Added support for guildMemberUpdate reasoning

### Backend
* Changed the name of the modules path: modules => dbFunctions
* Some emoji changes
* A cooldown system! Tacked onto the d.js User object, and the cooldowns are customized per command.
* config: Modes are now booleans instead of flags. They're now controlled by command-line-arguments
* Added my own personal User class to help with balance and rep and such. I plan on adding in a whole profile system with moods, badges, and reputation
* Removed bank file in favor of the custom User class
* Had to disable a feature of the database watchdog, see issue #3 https://gitlab.com/akii0008/lwbot-rewrite/issues/3

### Modules
* Deleted emojiLog
* Deleted roleAssign
* Deleted wtc

### Misc
* index:
  * Simplified wrong-node error message
  * Added sentry.io support.. I'm finding I'm not really using it all that much although it seemed cool. Will probably remove it.
  * Added command-line-arguments instead of my own makeshift cli parsing technique.
  * Added support for CI
* Added some variables to .env.default
* Added a CI, finally
* Separated out the webhook data and web panel into their own repos, then submodule'd them here
* Changed around the README
* Updated / added some packages
  * discord.js v11.4.2 => v11.5.0
  * Added convert-units@2.3.4
  * Added node-fetch@2.5.0
  * Added @sentry/node@5.4.0
  * Added command-line-args@5.1.1
  * Added puppeteer@1.17.0
* Switched to yarnpkg

## v1.5.3 [5/2/2019]
Wow it has been a few months since the last one of these. From the last release to now, there have been 133 commits. 104 files were changed.
I've also skipped a TON of versions. Because so much has happened between now and the last release.

### Backend
A TON HAPPENED HERE!
* bank: Moved this whole thing into its own file
* src/modules/client/misc:
  * Checks for .loadCommand
  * Added prototype extentions to their own file (src/modules/client/protos)
* src/modules/client/protos: created this.
* src/modules/client/tags: This file now houses the tags database.
* src/modules/message/commands: Support for per-server command configuration. Enable, disable, permlevel, the whole nine yards. Pretty neat.
* src/modules/message/misc: moved message.send and message.functions into its own file.. here.
* src/modules/message/modbase: Modbase database now lives here.
* src/modules/message/settings: Settings database now lives here.
* src/modules/settings/xp: Xp database now lives here.
* Deleted src/modules/msgfunctions: Broken up into own files now
* util/Logger: Added some more logging types (verbose, sqLog)
* util/cleanperms: Just in case I ever need to clean some perms, there they are.
* src/util/sqWatchdog: **THE HOLY GRAIL OF MY DATABASE SYSTEM!** Makes sure everything is in order and is working and is there. Cleans xp, settings, and commands.
* src/util/statuses: Now a function module because I needed client to be passed to it. Added and removed some statuses

### Addons
* emojiLog: I thought I added this way earlier but I guess not. It's here now.
* events/raw -> modules/roleAssign: Moved the role assign portion out of the actual bot and into its own file where it belongs. Not core functionality, does not belong in the core.
* terminal: x === undefined || x === null -> !x
* wtc: x === undefined || x === null -> !x ; :x: -> ❌

### Package
* Added aki-api
* Updated buncha stuff https://gitlab.com/akii0008/lwbot-rewrite/blob/a9c74dd8749736ede109c8168ce375bcb5a45245/package.json
* Moved some not-core packages into devdependencies

### Commands
* Economy/eco: parseInt(x) -> +x (Learned this one in a "confusing nuances of js" video), also changed :x: to ❌
* Added Fun/akinator with package [aki-api](http://npmjs.com/package/aki-api)
* Fun/ascii: :x: -> ❌
* Fun/cowsay: :x: -> ❌
* Fun/slots: :x: -> ❌
* Fun/sparkle :x: -> ❌ ; :white_check_mark: -> ✅ ; exports.conf.hidden = true
* Fun/urban: Fixed shit
* Fun/google: emoji changes
* Moderation/ban: Negation changes, emoji changes
* Added Moderation/case: Allows Moderator to view case by ID
* Moderation/hackban: Negation changes, emoji changes
* Moderation/kick: Negation changes, emoji changes
* Added Moderation/lock: Locks a channel for an optional temporary time, and for an optional reason.
* Moderation/modlogs: Negation changes, emoji changes
* Moderation/mute: Negation changes, emoji changes
* Moderation/purge: emoji changes
* Moderation/softban: Negation changes, emoji changes
* Moderation/tempban: Negation changes, emoji changes
* Moderation/tempmute: Negation changes, emoji changes
* Moderation/unban: Negation changes, emoji changes
* Added Moderation/unlock: Unlocks a locked channel
* Moderation/unmute: Negation changes, emoji changes
* Added Moderation/update: Updates a case by ID
* Moderation/voiceban: Negation changes, emoji changes
* Moderation/voicekick: Negation changes, emoji changes
* Moderation/warn: Negation changes, emoji changes
* Server/addemoji: emoji changes
* Server/announce: emoji changes
* Added Server/commandconf: Configures guild-specifc command settings
* Server/guildinfo: formatting, emoji changes
* Server/levels: formatting
* Server/quote: Added mention support
* Server/role: formatting, bug fix
* Added Server/stafflist: Lists the server's staff as configured by role permissions
* System/diagnose: emoji changes
* System/eval: Required backend changes, like database shifts.
* System/help: Formatting, emoji changes
* System/info: Changed it up a little
* System/invite: Now uses d.js provided invite link generator instead of the jank one I had earlier
* System/permlevel: Added DM support
* System/ping: aliases
* System/power: pm2 detection and support
* System/registercmd: emoji changes
* System/reload: emoji changes
* System/set: Required new database backend and reconfigured command as such; emoji changes
* System/stats: Support for macOS, need to create support for windows
* System/sys: emoji changes
* Tags/addtag: emoji changes
* Tags/deltag: emoji changes
* Tags/edittag: emoji changes
* Tags/tag emoji changes
* Tags/taginfo: emoji changes

### Events
* channelCreate: Fixed million-role bug. Ended up being that as the bot cached new channels, it emitted the channelCreate event. This was especially so when the bot joined a guild it hadn't seen before.
* guildCreate: Settings are now systematically created instead of manually; million-role bug fix; emoji changes
* Removed guildMemberAdd. To add back at another date.
* message: ~~oh boi here we go \*inhale*~~
  * Benchmarks! I can see how long shit takes from verbose mode stats command
  * Required new backend database configurations
    * Settings
    * Commands
    * Xp
  * Caps warning system
  * Xp / leveling system (thanks to Mee6's leveling formula)
  * Added check for exports.conf.requiresEmbed: fails if true and bot does not have EMBED_LINKS
  * I need to remove the database checks at the bottom thanks to the bot's own watchdog
* messageUpdate: verbose logging
* ratelimited: ascii warning
* ready: checks to see if user is bot, if not, exits; Froth it Dan; new ready log

### Uncategorized
* index:
  * Took init function out, it's just code now. Not a function. Not needed when I installed the walk package a while ago.
  * Moved .on's around
  * Now detects if sqlite3 package needs to be manually installs and installs it. Then exits.
* webhook data: Updated.. but not recent.
* websocket testing in progress! Havent worked on it recently but we're getting there.

### Music is back!
Yes sir we have music again. Not finished, but it's mostly there. I need to integrate it with the currency system so that the server owner's balance gets depleted per minute of the song playing.
* nowplaying: Shows currently playing song
* pause: Pause current song
* play: Plays and/or queues a song - Made with code that I absolutely and with *no* regrets stole from [DevYukine](https://github.com/DevYukine/Music-Bot)
* queue: Queue control (list, remove, add, loop, shuffle, clear)
* resume: Resumes a paused song
* skip: Skips current track (1 user, skips. More than one, needs a majority vote.)
* stop: Stop playback, clears queue, leave vc
* volume: Controls playback volume

Looking back on this release, I'm realizing it's created a whole half of the file. Possibly more. This update brings more functionality than any of the other features *combined.* Imagine that.

## v1.4.8 [1/3/2019]
First release of 2019 \o/
### Command edit functionality
A user sends a command. The bot sends the output. The user edits the command message to a new command. The bot edits the corresponding output.<br>
This takes into account embeds, message options, reactions, and sets them all accordingly.

## v1.4.7 [12/1/2018]
Yes, I jumped a few patch versions. Please don't shoot me.
Changes since last release:
#### Backend
* Added .env file and associating npm package to help with that
* Configured files (like index and Fun/kiss.js) that require environment variables
* Added requiresEmbed check: bot will check if command requires embed permissions and error if it doesn't have them.
* Configured files accordingly ^
* msgfunctions: Added various parsings (role, channel, member, user)
* **COMPLETE REVAMP OF PERMS:** Added collection client.settings, then ran through every database and mapped the server ID to their corresponding settings. I then changed config.js to match (ex: `const modrole = client.settings.get(message.guild.id).modRole`)
* Moved tags database into the client object.
* config: removed tokens
* config: debugMode is now a boolean that can be accessed directly from there. `process.argv.includes('-d') || process.argv.includes('--debug')`
* index: Added warning for debug mode
* index: changed debug to client.config.debugMode
* modules/functions: moved tags database into client object
* util/Logger: Colored some stuff, added debug logging. Only accessible through -d flag at startup.

#### Commands
* Economy/slots -> Fun/slots: Fixes issue #1
* Fun/banne: Joke ban
* Fun/sparkle: Added role hierarchy check. If the target member's role is higher than the bot's, error.
* Fun/urban: Fixed command. Wasn't working at all before, now it is. Removed broken npm package.
* Misc/userinfo -> Server/userinfo: Generally cleaned up this code
* Moderation/ : Fixed those commands. They were saying 'moderated undefined'.
* Moderation/purge: Added this command. Have yet to loop per every 100 messages.
* Server/role: Added this command. Gives information of role
* Server/roles: Deleted this command. This was the role menu for WTC
* System/diagnose: Cleaned this up. It isn't as ugly now.
* System/eval: Also cleaned this up.
* System/help: At this point just go to the commits:
* System/registercmd: Added this. More backend, but this registers a command (client.loadCommand) just so I don't have to restart the bot every time I add a new command.
* System/reload: Added file reloading
* System/set: Added changing of client.settings through this, as well as updating the database.
* System/sys: Kind of matches eval now, at least in styling. Same bash functionality, but cleaner and prettier. and smarter.
* Tags/ : Changed backend of commands to match the tags database now being part of the client object

#### Events
* channelCreate: More muted role checks! Still not fixed though, dunno why.
* guildCreate: On guildcreate, the bot now adds settings to the database. I should also have it add stuff to the collection...
* guildCreate: Checks if it has the necessary permissions. If it doesn't, it errors (sends guild owner error info)
* guildMemberAdd: Integrated the welcome portion with database settings
* message:
  * args now uses the cleanContent
  * systemNotice fix, I was using `prefix` by accident
  * Checks to make sure the bot has permission to send embeds if configured in command.conf
  * Added another setting: owner role. I did this because many servers have multiple owners under the same role.
* raw: Removed spoopy stuff, added back partnerships to role menu. Also, oops, i forgot to remove the kill list database stuff, apparently.
* ready: *Moved the huge playing statuses array into its own file!* This freed up a lot of space in there.
* ready: Now runs through every server's database for settings and maps it to client.settings

## v1.4.3 [10/6/2018]
* Just some backend stuff. I moved the commands into folders based on their category. I also added the [walk package](http://npm.org/package/walk) to help with this since fs doesn't have the native functionality to read directories inside directories.
* Also fixed the help command. I accidentally removed the `level` argument from `cmd.run` in the message event, only because I *thought* no command was using it. turns out, help needs it.

## v1.4.2 [9/26/2018]
A *lot* has changed.
### Per-guild settings
Thanks to [sqlite3](https://www.sqlite.org/index.html) and [Sequelize](http://docs.sequelizejs.com/), I now have per-server settings.
It's possible to edit, add, and delete these settings using the `<prefix> set` command. A website/control panel is in the making to make this a bit easier.. the syntax is a bit confusing on its own.

### Moderation Commands
Ban, kick, mute, warn, etc etc. have now been created and they work. These commands also intigrate with the server moderation sqlite database

### XP System [In development]
Created an XP system that that utilizes the server sqlite database. **Gives 1 or 2 XP per minute.**

### Currency System [In development]
Scrapped the old currency system from djs.guide, created my own from scratch. Utilizes a *global* database. That's right, currency is *not* per-server, otherwise it'd be called XP, and I already created that. Now all I need to do is find some ways to implement them.


> There is no documentation between version 1.3.0 and 1.4.2. The only documentation is in the commits.


## v1.3.0
### Music
Created music functionality from [iCrawl's tutorial](https://github.com/Dev-Yukine/Music-Bot) (thanks bud ❤)<br>
`+` !w play<br>
`+` !w pause<br>
`+` !w resume<br>
`+` !w skip<br>
`+` !w queue<br>
`+` !w np<br>
`+` !w volume <#≤10>

### Currency
Created currency system from [discordjs.guide](http://discordjs.guide)<br>
`+` !w balance<br>
`+` !w buy<br>
`+` !w shop<br>
`+` !w inventory<br>
`+` !w daily<br>
`+` !w leaderboard<br>
`+` !w transfer<br>
`+` Adds one Kowok to user per message

### Tags
Created tags system from [discordjs.guide](http://discordjs.guide)<br>
`+` !w tag<br>
`+` !w addtag<br>
`+` !w removetag<br>
`+` !w showtags<br>
`+` !w taginfo

### Other Commands
`+` !w urban
>Found on [the github rewrite repo](http://github.com/jennasisis/lwbot-rewrite)


## Release v1 - Christmas
### First Release - v1.0.0
This is the first version of the bot that got publicly released to the server
>Found on [the original repo](http://github.com/jennasisis/lwbot)