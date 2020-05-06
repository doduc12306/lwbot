const fetch = require('node-fetch');
module.exports.run = async (client, message, [language, ...code]) => {
  const possibleLanguages = [
    'c', 'cpp', 'objective-c',
    'kotlin', 'java', 'scala',
    'swift', 'csharp', 'go',
    'haskell', 'perl', 'erlang',
    'python', 'python3', 'ruby',
    'php', 'bash', 'r',
    'javascript', 'coffeescript', 'vb',
    'cobol', 'fsharp', 'd',
    'clojure', 'mysql', 'elixir',
    'rust', 'scheme', 'commonlisp',
    'plain'
  ];

  if (!language) return message.send('❌ `|` 📝 **You didn\'t give me a language to run!**');
  if (!possibleLanguages.includes(language)) return message.send(`❌ \`|\` 📝 **Invalid language!** Possible languages: ${possibleLanguages.map(lang => `\`${lang}\``).join(', ')}`);

  if (!code) return message.send('❌ `|` 📝 **You didn\'t give me any code to run!**');
  code = code.join(' '); // the code parameter returns an array. this turns it into a string

  const msg = await message.send('<a:loading:536942274643361794> `|` 📝 **Running...** `(0/2)`');

  const encodedCode = encodeURIComponent(code); // lol encoded code

  // Make a POST request to the code runner, get an ID that's associated with the currently running code
  const runnerID = await fetch(`http://api.paiza.io:80/runners/create?source_code=${encodedCode}&language=${language}&api_key=guest`, { method: 'POST' })
    .then(res => res.json())
    .then(async res => {
      await msg.edit('<a:loading:536942274643361794> `|` 📝 **Running...** `(1/2)`');

      return res.id;
    }).catch(async e => {
      client.logger.error(e);
      return false; // If there was an error, make `runnerID` false, which is checked below
    });

  if (!runnerID) return await msg.edit('❌ `|` 📝 **There wasn an error running the code.** Please try again later.');

  await client.wait(1000); // Wait a lil for the code to run...

  (function runCode() {
    // Make a request to the code details endpoint. This will give us output, error, etc.
    fetch(`http://api.paiza.io:80/runners/get_details?id=${runnerID}&api_key=guest`)
      .then(res => res.json())
      .then(async res => {
        // If the code is still running, call the run function again, recursively.
        if (res.status === 'running') return runCode();

        await msg.edit('<a:loading:536942274643361794> `|` 📝 **Running...** `(2/2)`');

        if (res.result === 'timeout') return await msg.edit('❌ `|` 📝 **Error: Timeout** `|` **Code took too long to run.**');
        if (res.build_stderr) return await msg.edit(`❌ \`|\` 📝 **Build error:**\n\`\`\`\n${res.build_stderr}\`\`\``);
        if (res.stderr) return await msg.edit(`❌ \`|\` 📝 **Runtime error:**\n\`\`\`\n${res.stderr}\n\`\`\`Took: \`${res.time}\` seconds.`);

        if(res.result === 'success' && res.stdout.trim() === '') res.stdout = '<No output>';
        return await msg.edit(`✅ \`|\` 📝 **Output:**\n\`\`\`\n${res.stdout}\n\`\`\`Took: \`${res.time}\` seconds.`);
      }).catch(async e => {
        if(e.message.includes('Invalid Form Body')) { // Total message was too long
          return await msg.edit(`:warning: \`|\` 📝 **Output was too long.**\nHere's the link: http://api.paiza.io:80/runners/get_details?id=${runnerID}&api_key=guest`);
        }

        client.logger.error(e);
        return await msg.edit('❌ `|` 📝 **There wasn an error running the code.** Please try again later.');
      });
  })();

};

exports.conf = {
  enabled: true,
  permLevel: 'User',
  aliases: ['code', 'run'],
  guildOnly: false,
  cooldown: 20000 // 10 seconds
};

exports.help = {
  name: 'runcode',
  description: 'Run code. Possible languages: c, cpp, objective-c, kotlin, java, scala, swift, csharp, go, haskell, perl, erlang, python, python3, ruby, php, bash, r, javascript, coffeescript, vb, cobol, fsharp, d, clojure, mysql, elixir, rust, scheme, commonlisp, plain',
  usage: 'runcode <language> <code>',
  category: 'Misc'
};