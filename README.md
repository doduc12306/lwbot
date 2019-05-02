# LINE WEBTOON Bot
Soon to be public Discord bot.

Migrated from [GitHub](http://github.com/jennasisis/lwbot-rewrite) a *long* time ago.<br>
Was originally [just lwbot on github](http://github.com/jennasisis/lwbot).
* Both of these repositories have been archived. ~~My GitHub is no longer in use due to Microsoft aquiring them.~~ My Github is now active, but for a different reason.

Tested in Node:
* v8.x [Minimum d.js requirement]
* v10.x
  * v10.8.0
  * v10.15.3
* v11.x
  * v11.3.0
* **v12.x DOES NOT WORK! DO NOT USE!** For some reason, one of the packages I use, sqlite3, doesn't like node 12. **Do not use node 12.**

Tested on:
* macOS
* Windows x64
* Linux
  * Ubuntu - 16.04
  * Ubuntu - 18.04 (+Docker)
  * Ubuntu - 18.10 (+Docker)
  * Manjaro
  * Linux Mint.. at some point?

## This will not work directly out of the box.
You need to have some sort of understanding of Node and how errors work to understand how you'll set this up.
Best I can tell you is run `npm i` or `yarn` to get things a'rollin.
And create a src/databases(/servers & /users) folder.

### [License](LICENSE.md)
[![GNU AGPLv3](https://i.imgur.com/m7Khb4u.png)](https://choosealicense.com/licenses/agpl-3.0/)

### [Changelog](CHANGELOG.md)