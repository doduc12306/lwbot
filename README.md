# LINE WEBTOON Bot
Almost a general-purpose Discord bot

[![](https://gitlab.com/akii0008/lwbot-rewrite/badges/master/pipeline.svg)](https://gitlab.com/akii0008/lwbot-rewrite/pipelines)<br>
^ That pipeline is almost always failing. Don't worry, the bot works. I make sure it works before I push it.<br>
If it's not failing, I must have done something right, or I've finally worked out the kinks in the [pipeline config](/.gitlab-ci.yml).

Migrated from [GitHub](http://github.com/jennasisis/lwbot-rewrite) a *long* time ago.<br>
Was originally [just lwbot on GitHub](http://github.com/jennasisis/lwbot), however both of these repositories have been archived.

**Requires at least Node 12.**<br>

### ⚠️ **This bot was not designed to be hosted by someone who isn't me.**
The only reason it's on this site is because I believe ✨ open source software ✨ is important. ✨ There are so many variables here, such as the CI configuration, that are specific to myself. If you *really* know what you're doing, feel free to fork it and change those variables to suit your own needs. Maybe one day I'll make it more publicly friendly.
Now, *sure*, it will work if you're not me. I make sure it works on other environments because I frequently switch between environments. But half of the stuff you find won't be useful to you.

### That said, 
If you'd like to run it, here are the steps I go through when moving to a new environment:

0. Rename `.env.default` to `.env` and fill out all the necessary fields (usually only TOKEN and DEBUG_TOKEN for a minimal install).
1. Run `yarn build` to install the necessary libraries. **This only works for Debian/Ubuntu based linux distros.** On other operating systems, you'll have to run it, see what the errors are, and do some googling.
2. Run `yarn` to install the packages.
3. Run the bot once with `node src/index.js -dv`. This runs it with debug and verbose mode enabled. **It will error the first time when creating logs for the current day.** After that it'll be fine.
4. Exit with ^C (CTRL + C)
5. Run `node src/index.js -dv` again to make sure everything is working.
6. If, for whatever reason, the databases dont propagate (which will be obvious when the bot doesn't respond on Discord), I take the ID of a server the bot is on and place it in the `src/databases/servers/` folder under `<id here>.sqlite`, restart the bot, and the rest should load.
7. Once I'm sure everything works, I run `pm2 start index.js --name "bot name here" -- -v`, which runs the bot under [pm2](https://www.npmjs.com/package/pm2) in production mode with verbose logging enabled, and I let it run.

To see every option the bot has, run `node src/index.js --help`.

---

## [LICENSE.md](LICENSE.md)
[![MIT](https://i.imgur.com/uK1n616.png)](https://choosealicense.com/licenses/mit)

## [CHANGELOG.md](CHANGELOG.md)