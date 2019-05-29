# LINE WEBTOON Bot
Soon to be public Discord bot.

[![](https://gitlab.com/akii0008/lwbot-rewrite/badges/master/pipeline.svg)](https://gitlab.com/akii0008/lwbot-rewrite/pipelines)

Migrated from [GitHub](http://github.com/jennasisis/lwbot-rewrite) a *long* time ago.<br>
Was originally [just lwbot on github](http://github.com/jennasisis/lwbot).
> Both of these repositories have been archived.

Tested in Node: v8.x - v11.x. <br>
**v12.x DOES NOT WORK! DO NOT USE!** For some reason, one of the packages I use, sqlite3, doesn't like node 12. **Do not use node 12.**

Tested wherever Node works, including an iPhone (yes, really o.o)

### ⚠️ **This will not work directly out of the box.**
You need to have some sort of understanding of Node and how errors work to understand how you'll set this up.
Best I can tell you is run `npm i` or `yarn` to get things a'rollin.<br> The [CI file](src/util/ci.js) is not for you. There are some me-specific variables in there, like my own server's ID and corresponding channels/members. If you really *really* want to, you can change them on your own repo should you choose to fork this. Also, the splicing is token-specific to me. I don't know if it works with other tokens, I would not recommend it.
> If someone wants to write a wiki for me, go ahead. I'm too lazy to write one myself. Submit a PR and I'll look over it.

---

## [License](LICENSE.md)
[![GNU AGPLv3](https://i.imgur.com/m7Khb4u.png)](https://choosealicense.com/licenses/agpl-3.0/)

## [Changelog](CHANGELOG.md)