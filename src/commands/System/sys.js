const { post } = require('snekfetch');

module.exports.run = async (client, message, args) => {
  const code = args.join(' ');
  const token = client.token.split('').join('[^]{0,2}');
  const rev = client.token.split('').reverse().join('[^]{0,2}');
  const filter = new RegExp(`${token}|${rev}`, 'g');
  try {
    require('child_process').exec(code, async (e, out, err) => {
      if(e || err) return message.send(e || err, {code: 'xl'});
      out = out.replace(filter, 'FILTERED TOKEN');
      out = clean(out);
      if (out.length < 1950) {
        message.send(out, {code: 'bash'});
      } else {
        try {
          const { body } = await post('https://www.hastebin.com/documents').send(out);
          message.send(`:x: **Output too long, uploaded to hastebin:** https://www.hastebin.com/${body.key}.js `);
        } catch (error) {
          message.send(`:x: **Hastebin upload error:** \`${error.name}\`\n\`\`\`\n${error.message}\n\`\`\``);
        }
      }
    });
  } catch (error) {
    message.send(`\`\`\`xl\n${error}\n\`\`\``);
  }

  function clean(text) {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(/(\[\w+)|(\1;\d+m)/g, String.fromCharCode(8203));
  }
};

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 'Bot Owner',
  guildOnly: false
};

exports.help = {
  name: 'sys',
  description: 'Executes bash script',
  category: 'System',
  usage: 'sys <bash>'
};