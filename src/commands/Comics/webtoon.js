const { MessageEmbed } = require('discord.js');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

module.exports.run = (client, message, args) => {
  let mode; // featured OR discover
  if (!['featured', 'original', 'originals', 'discover', 'discovery', 'canvas'].includes(args[0])) mode = 'featured';

  if (!args[0]) return message.send('❌ `|` 🔎 **You didn\'t specify featured or canvas webtoon to search!**');
  if (args[0] === 'featured') mode = 'featured';
  else if (['discover', 'discovery', 'canvas'].includes(args[0])) mode = 'discover';
  if (['featured', 'original', 'originals', 'discover', 'discovery', 'canvas'].includes(args[0]) && !args[1]) return message.send('❌ `|` 🔎 **You didn\'t give me anything to search!**');

  const search = ['featured', 'original', 'originals', 'discover', 'discovery', 'canvas'].includes(args[0]) ? args.slice(1).join(' ') : args.slice(0).join(' ');

  message.send(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(0 / n)\``).then(async msg => {
    try {
      let res = await fetch(`https://www.webtoons.com/search?keyword=${search}`).then(page => page.text());
      let $ = cheerio.load(res);
      msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(1 / n)\``);
      if($('div.card_nodata').length === 1) return msg.edit(`❌ \`|\` 🔎 **No results for** \`${search}\``);

      if (mode === 'featured') {

        const searchResult = $('div.card_wrap.search ul.card_lst li a.card_item').attr('href');
        if(!searchResult) return msg.edit(`❌ \`|\` 🔎 **No featured webtoon results for** \`${search}\``);
        res = await fetch(`https://www.webtoons.com${searchResult}`).then(page => page.text());
        const page = cheerio.load(res);
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(2 / n)\``);

        $ = cheerio.load(page('div.cont_box div.detail_body.banner div.detail_lst ul').children().first().html());
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(3 / n)\``);

        const episode = {
          name: $('a span.subj span').text(),
          thumbnail: $('a span.thmb img').attr('src'),
          date: $('a span.date').text(),
          link: $('a').attr('href')
        };
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(4 / n)\``);

        const title = page('div.cont_box div.detail_header div.info h1.subj').text();
        const summary = page('div.cont_box div.detail_body.banner div p.summary').text();
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(5 / n)\``);

        const embed = new MessageEmbed()
          .setColor(client.accentColor)
          .setTitle(title)
          .setDescription(summary)
          .addField('Latest Episode', `[${episode.name}](${episode.link})`)
          .setThumbnail(episode.thumbnail)
          .setTimestamp(new Date(episode.date));

        msg.edit('', { embed });

      } else if (mode === 'discover') {

        const searchResult = $('div.card_wrap.search div.challenge_lst.search ul li a.challenge_item').attr('href');
        if(!searchResult) return msg.edit(`❌ \`|\` 🔎 **No canvas webtoon results for** \`${search}\``);
        res = await fetch(`https://www.webtoons.com${searchResult}`).then(page => page.text());
        const page = cheerio.load(res);
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(2 / n)\``);

        $ = cheerio.load(page('div.cont_box div.detail_body.challenge div.detail_lst ul').children().first().html());
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(3 / n)\``);

        const episode = {
          name: $('a span.subj span').text(),
          thumbnail: $('a span.thmb img').attr('src'),
          date: $('a span.date').text(),
          link: $('a').attr('href')
        };
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(4 / n)\``);

        const title = page('div.cont_box div.detail_header.challenge div.info.challenge h3.subj._challengeTitle').text().split('DASHBOARD')[0].trim();
        const summary = page('div.cont_box div.detail_body.challenge div p.summary').text();
        msg.edit(`${client.emojis.cache.get('536942274643361794')} **One moment please...**  \`(5 / n)\``);

        const embed = new MessageEmbed()
          .setColor(client.accentColor)
          .setTitle(title)
          .setDescription(summary)
          .addField('Latest Episode', `[${episode.name}](${episode.link})`)
          .setThumbnail(episode.thumbnail)
          .setTimestamp(new Date(episode.date));

        msg.edit('', { embed });
      }

    } catch (e) {
      msg.edit(`❌ \`|\` 🔎 **Something went wrong! Please try again later.**\n\`\`\`${e}\`\`\``);
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
  name: 'webtoon',
  description: 'Find a webtoon!',
  usage: 'search [original (default) / canvas] <title name>',
  category: 'Comics'
};