/* eslint-env browser */
/* eslint-disable no-unused-vars */
const wait = ms => new Promise((r, j) => setTimeout(r, ms));

// When the DOM content loads, if the user had dark mode enabled before, enable it now.
// Credit: https://flaviocopes.com/dark-mode/
document.addEventListener('DOMContentLoaded', async (event) => {
  ((localStorage.getItem('mode') || 'dark') === 'dark')
    ? document.querySelector('body').classList.add('dark')
    : document.querySelector('body').classList.remove('dark');

  // Wait to load everything, then add the style.
  // Otherwise, if it's default dark mode, we blind the user because it loads light first.
  await wait(500);
  await (document.body.style = 'transition: all 250ms ease-in-out;');
});

let x = 0;
async function toggleDark() {
  const bodyClassList = document.getElementById('body').classList;
  const boo = document.getElementById('boo');

  function addDark() {
    console.log('👻 dark boi: ' + (x + 1));
    bodyClassList.add('dark');
    localStorage.setItem('mode', 'dark');
  }
  function removeDark() {
    console.log('☀ light boi: ' + (x + 1));
    bodyClassList.remove('dark');
    localStorage.setItem('mode', 'light');
  }

  bodyClassList.contains('dark') ? removeDark() : addDark();
  x++; // Count the user's clicks..
  boo.innerHTML = `(boo x${x})`;

  if(x === 100) {
    boo.innerHTML = '(BOO!)';
    await wait(300);
    return window.location = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // rick rolled ;)
  }
}