# Changelog

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
Created music functionality from [iCrawl's tutorial](https://github.com/Dev-Yukine/Music-Bot) (thanks bud ❤)
`+` !w play<br>
`+` !w pause<br>
`+` !w resume<br>
`+` !w skip<br>
`+` !w queue<br>
`+` !w np<br>
`+` !w volume <#≤10>

### Currency
Created currency system from [discordjs.guide](http://discordjs.guide)
`+` !w balance<br>
`+` !w buy<br>
`+` !w shop<br>
`+` !w inventory<br>
`+` !w daily<br>
`+` !w leaderboard<br>
`+` !w transfer<br>
`+` Adds one Kowok to user per message

### Tags
Created tags system from [discordjs.guide](http://discordjs.guide)
`+` !w tag
`+` !w addtag
`+` !w removetag
`+` !w showtags
`+` !w taginfo

### Other Commands
`+` !w urban
>Found on [the github rewrite repo](http://github.com/jennasisis/lwbot-rewrite)


## Release v1 - Christmas
### First Release - v1.0.0
This is the first version of the bot that got publicly released to the server
>Found on [the original repo](http://github.com/jennasisis/lwbot)