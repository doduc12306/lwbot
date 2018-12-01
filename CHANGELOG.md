# Changelog

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