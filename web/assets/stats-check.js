/* eslint-disable no-undef */
const checkClient = new Discord.Client();
// const client = new Discord.Client();

var loginTimer = setTimeout(async () => window.location.reload(false), 5000);

checkClient.on('ready', async () => {
  console.log(`Ready! ${checkClient.user.tag} (${checkClient.user.id})`);
  clearTimeout(loginTimer);

  setInterval(async () => {
    var lwbot = checkClient.users.get('377205339323367425');

    var online_indicator = document.getElementById('online-indicator');
    var online_text = document.getElementById('online-text');
    var playing_type = document.getElementById('playing-type');
    var playing_game = document.getElementById('playing-game');

    var playing_parent_ele = document.getElementById('playing-parent-ele');
    var playing_game_ele = document.getElementById('playing-game-ele');

    if(lwbot.presence.status === 'online' || lwbot.presence.status === 'idle' || lwbot.presence.status === 'dnd') {
      online_text.innerText = 'ONLINE';
      online_indicator.style = 'text-align:center;background-color:var(--blurple1);border-radius:10px;padding-bottom:11px;transition: all 700ms cubic-bezier(0.075, 0.82, 0.165, 1);';

      if(lwbot.presence.game.type === 0 || lwbot.presence.game.type === 1) {
        playing_type.innerText = 'PLAYING A GAME';
        playing_game.innerText = lwbot.presence.game.name;
      }
      else if(lwbot.presence.game.type === 2) {
        playing_type.innerText = `LISTENING TO ${lwbot.presence.game.name}`;
        playing_parent_ele.removeChild(playing_game_ele);
      }
      else if(lwbot.presence.game.type === 3) {
        playing_type.innerText = `WATCHING ${lwbot.presence.game.name}`;
        playing_parent_ele.removeChild(playing_game_ele);
      }
    }
    else { // see i love this cuz im fucking creating elements out of ☆ ･*。thin air ☆ ･*。
      var parent = document.getElementById('parent');
      var etr = document.getElementById('cont1');
      var footer = document.getElementById('footer');
      await parent.removeChild(etr);

      var container = document.createElement('div');
      container.className = 'container';
      await parent.insertBefore(container, footer);

      var row = document.createElement('div');
      row.className = 'row';
      row.style = 'text-align:center;';
      await container.appendChild(row);

      var colSm4_1 = document.createElement('div');
      colSm4_1.className = 'col-sm-4';
      await row.appendChild(colSm4_1);

      var colSm4_2 = document.createElement('div');
      colSm4_2.className = 'col-sm-4';
      colSm4_2.style = 'text-align:center;background-color:var(--attention);border-radius:10px;padding-bottom:11px;transition: all 700ms cubic-bezier(0.075, 0.82, 0.165, 1);';
      var colSm4_2_h1 = document.createElement('h1');
      colSm4_2_h1.style = 'color=var(--white1);';
      colSm4_2_h1.innerText = 'OFFLINE';
      await colSm4_2.appendChild(colSm4_2_h1);
      await row.appendChild(colSm4_2);

      var colSm4_3 = document.createElement('div');
      colSm4_3.className = 'col-sm-4';
      await row.appendChild(colSm4_3);
    }
  }, 15000);
});

checkClient.login('Mzk0OTEzOTAzNDY2OTA1NjAx.DjQGOQ.mY72NtjW9Q471rujcfAiO8bwnwg');
//client.login('Mzc3MjA1MzM5MzIzMzY3NDI1.DjQGXg.kmLeidsPNrpDhQWB-2YdaCvCmUg');