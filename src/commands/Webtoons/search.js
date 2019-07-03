const puppeteer = require('puppeteer');
const { RichEmbed } = require('discord.js');

module.exports.run = (client, message, args) => {
  let mode;
  if (!['featured', 'discover', 'discovery', 'canvas'].includes(args[0])) mode = 'featured';

  if (!args[0]) return message.send('❌ `|` 🔎 **You didn\'t specify featured or canvas webtoon to search!**');
  if (args[0] === 'featured') mode = 'featured';
  else if (['discover', 'discovery', 'canvas'].includes(args[0])) mode = 'discover';
  if (['featured', 'discover', 'discovery', 'canvas'].includes(args[0]) && !args[1]) return message.send('❌ `|` 🔎 **You didn\'t give me anything to search!**');

  const search = ['featured', 'discover', 'discovery', 'canvas'].includes(args[0]) ? args.slice(1).join(' ') : args.slice(0).join(' ');

  message.send(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(0 / 5)\``).then(async msg => {
    try {
      // Initialize browser
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(1 / 5)\``);

      await page.goto(`https://www.webtoons.com/search?keyword=${search}`);
      await msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(2 / 5)\``);

      if (await page.$('div.card_nodata')) { // If the search result returned empty
        msg.edit('❌ `|` 🔎 **I couldn\'t find a webtoon by that name!**');
        return browser.close();
      }

      if (mode === 'featured') {

        await page.click('ul.card_lst li a');
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(3 / 5)\``);

        const title = await page.$eval('div.cont_box div.detail_header.type_white div.info h1.subj', async e => await e.innerHTML);
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
          .setColor(message.guild.accentColor)
          .setTitle(title)
          .setURL(url)
          .setDescription(description)
          .setThumbnail(thumbnail)
          .addField(`Episode ${lastEpisode.number}`, `[${lastEpisode.title}](${lastEpisode.url})`)
        );

        await browser.close();

      } else if (mode === 'discover') {

        await page.click('div.challenge_lst ul li a');
        msg.edit(`${client.emojis.get('536942274643361794')} **One moment please...**  \`(3 / 5)\``);

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
          .setColor(message.guild.accentColor)
          .setTitle(title)
          .setURL(url)
          .setDescription(description)
          .setThumbnail(thumbnail)
          .addField(`Episode ${lastEpisode.number}`, `[${lastEpisode.title}](${lastEpisode.url})`)
        );

        await browser.close();

      }

    } catch (e) {
      msg.edit(`❌ \`|\` 🔎 **Something went wrong! Please try again later.**\n\`\`\`${e}\`\`\``);
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
  usage: 'search [featured (default) / canvas] <title name>',
  category: 'Webtoons'
};