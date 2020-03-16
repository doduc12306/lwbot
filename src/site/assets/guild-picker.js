/* eslint-env browser */
(async function () {

  const res = await fetch('http://localhost:1337/api/guilds', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  }).then(res => res.json());

  console.log('Got guild list:', res);

  const guilds = [];
  res.forEach(guild => {
    guilds.push({ icon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` });
  });
})();