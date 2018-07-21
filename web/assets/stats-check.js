const checkClient = new Discord.Client();
// const client = new Discord.Client();

/* var loginTimer = setTimeout(async () => {
  var parent = document.getElementById('parent');
  var etr = document.getElementById('cont1');
  
  etr.style = "visibility:false;transition: all 800ms cubic-bezier(0.075, 0.82, 0.165, 1);"
  
}, 15000); */

checkClient.on('ready', async () => {
  console.log(`Ready! ${checkClient.user.tag} (${checkClient.user.id})`);
  // clearTimeout(loginTimer);

  var online_indicator = document.getElementById('online-indicator');
  var online_text = document.getElementById('online-text');
  var status_type = document.getElementById('playing-type');
  
  setInterval(async () => {
  var lwbot = checkClient.users.get('377205339323367425');
  if(lwbot.presence.status === "online" || lwbot.presence.status === "idle" || lwbot.presence.status === "dnd") {
      online_text.innerText = "ONLINE"
      online_indicator.style = "text-align:center;background-color:var(--blurple1);border-radius:10px;padding-bottom:11px;transition: all 700ms cubic-bezier(0.075, 0.82, 0.165, 1);"

      
  }
  else {
      var parent = document.getElementById('parent');
      var etr = document.getElementById('cont1');
      var footer = document.getElementById('footer');
      await parent.removeChild(etr);

      var container = document.createElement('div');
      container.className = "container";
      await parent.insertBefore(container, footer);
      
      var row = document.createElement('div');
      row.className = "row";
      row.style = "text-align:center;";
      await container.appendChild(row);

      var colSm4_1 = document.createElement('div');
      colSm4_1.className = "col-sm-4";
      await row.appendChild(colSm4_1);
      
      var colSm4_2 = document.createElement('div');
      colSm4_2.className = "col-sm-4";
      colSm4_2.style = "text-align:center;background-color:var(--attention);border-radius:10px;padding-bottom:11px;transition: all 700ms cubic-bezier(0.075, 0.82, 0.165, 1);";
      var colSm4_2_h1 = document.createElement('h1');
      colSm4_2_h1.style = "color=var(--white1);";
      colSm4_2_h1.innerText = "OFFLINE";
      await colSm4_2.appendChild(colSm4_2_h1);
      await row.appendChild(colSm4_2);

      var colSm4_3 = document.createElement('div');
      colSm4_3.className = "col-sm-4";
      await row.appendChild(colSm4_3);
    }
  }, 15000);
});

checkClient.login('Mzk0OTEzOTAzNDY2OTA1NjAx.DjQGOQ.mY72NtjW9Q471rujcfAiO8bwnwg');
//client.login('Mzc3MjA1MzM5MzIzMzY3NDI1.DjQGXg.kmLeidsPNrpDhQWB-2YdaCvCmUg');