const puppeteer = require('puppeteer');
const { RichEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
  let mode;
  if (!['featured', 'discover', 'discovery'].includes(args[0])) mode = 'featured';

  if (!args[0]) return message.send(':x: `|` :mag_right: **You didn\'t specify featured or discover, or a webtoon to search!**');
  if (args[0] === 'featured') mode = 'featured';
  else if (['discover', 'discovery'].includes(args[0])) mode = 'discover';
  if (['featured', 'discover', 'discovery'].includes(args[0]) && !args[1]) return message.send(':x: `|` :mag_right: **You didn\'t give me anything to search!**');

  const search = ['featured', 'discover', 'discovery'].includes(args[0]) ? args.slice(1).join(' ') : args.slice(0).join(' ');

  message.send(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(0 / 5)\``).then(async msg => {
    const errorTimer = setTimeout(() => { return msg.edit(':x: `|` :mag_right: **Something took too long! Please try again later.**'); }, 10000); // Ten second error timeout
    try {
      // Initialize browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(1 / 5)\``);

      await page.goto(`https://www.webtoons.com/search?keyword=${search}`);
      await msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(2 / 5)\``);

      await page.screenshot({ path: 'searchPage.png' });

      if (await page.$('div.card_nodata')) { // If the search result returned empty
        msg.edit(':x: `|` :mag_right: **I couldn\'t find a webtoon by that name!**');
        clearTimeout(errorTimer);
        return browser.close();
      }

      if (mode === 'featured') {

        await page.click('ul.card_lst li a');
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(3 / 5)\``);

        await page.screenshot({ path: 'actualPage.png', fullPage: true });

        const title = await page.$eval('div.detail_header div.info h1.subj', async e => await e.innerHTML);
        const description = await page.$eval('div.detail_body div.aside.detail p.summary', async e => await e.innerHTML);
        const thumbnail = await page.$eval('div.detail_body', async e => await e.getAttribute('style').split('url(')[1].split(')')[0]);
        const url = page._target._targetInfo.url;
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(4 / 5)\``);

        const lastEpisode = {
          title: await page.$eval('div.detail_lst ul li a span.subj span', async e => await e.innerHTML),
          number: await page.$eval('div.detail_lst ul li a span.tx', async e => await e.innerHTML),
          url: await page.$eval('div.detail_lst ul li a', async e => await e.getAttribute('href'))
        };
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(5 / 5)\``);

        msg.edit(new RichEmbed()
          .setColor(client.config.colors.green)
          .setTitle(title)
          .setURL(url)
          .setDescription(description)
          .setThumbnail(thumbnail)
          .addField(`Episode ${lastEpisode.number}`, `[${lastEpisode.title}](${lastEpisode.url})`)
        );
        clearTimeout(errorTimer);

        await browser.close();

      } else if (mode === 'discover') {

        await page.click('div.challenge_lst ul li a');
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(3 / 5)\``);

        await page.screenshot({ path: 'actualPage.png', fullPage: true });

        const title = await page.$eval('div.detail_header div.info h3.subj', async e => await e.innerHTML.split('<')[0].trim());
        const description = await page.$eval('div.detail_body div.aside.detail p.summary', async e => await e.innerHTML);
        const thumbnail = await page.$eval('div.detail_header span.thmb img', e => e.getAttribute('src'));
        const url = page._target._targetInfo.url;
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(4 / 5)\``);

        const lastEpisode = {
          title: await page.$eval('div.detail_lst ul li a span.subj span', async e => await e.innerHTML),
          number: await page.$eval('div.detail_lst ul li a span.tx', async e => await e.innerHTML),
          url: await page.$eval('div.detail_lst ul li a', async e => await e.getAttribute('href'))
        };
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(5 / 5)\``);

        msg.edit(new RichEmbed()
          .setColor(client.config.colors.green)
          .setTitle(title)
          .setURL(url)
          .setDescription(description)
          .setThumbnail(thumbnail)
          .addField(`Episode ${lastEpisode.number}`, `[${lastEpisode.title}](${lastEpisode.url})`)
        );
        clearTimeout(errorTimer);

        await browser.close();

      }

    } catch (e) {
      msg.edit(':x: `|` :mag_right: **Something went wrong! Please try again later.**');
      client.logger.error(e);
    }

  });
};

exports.conf = {
  enabled: true,
  aliases: ['searchwebtoon', 'webtoon', 'toon', 'webtoons'],
  guildOnly: false,
  permLevel: 'User'
};

exports.help = {
  name: 'search',
  description: 'Find a webtoon!',
  usage: 'search [featured (default) / discover] <title name>',
  category: 'Webtoons'
};