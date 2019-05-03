# Changelog

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
* play: Plays and/or queues a song
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