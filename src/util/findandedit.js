// The reason this file exists is because
// in the ytdl-discord package, there is a 
// broken require statement. It looks for files
// in a "lib" folder, when it's actually in a "dist"
// folder. This quick script fixes that error by
// manually editing the lines of code that
// have that incorrect require statement.
// I know this is bad practice to manually edit
// lines of code at runtime, however as long as
// the version stays the same there shouldn't be
// any issues. I even have version checking here
// to make sure nothing has changed.

const fs = require('fs-extra');
const package = require('../../package.json');
const ytdlcorediscordVersion = package.dependencies['ytdl-core-discord'];

console.log('ytdl-core-discord version:', ytdlcorediscordVersion);

if(ytdlcorediscordVersion !== '1.0.3') {
  console.error('Version mismatch!');
  console.error('  Expected ytdl-core-discord version: 1.0.3');
  console.error('  Actual ytdl-core-discord version:  ', ytdlcorediscordVersion);
  console.error('Not changing anything!');
  process.exit();
}

fs.readFile('../../node_modules/ytdl-core/lib/index.js', (err, data) => {
  if(err) throw err;
  data = data.toString();
  data = data.split('\n');
  console.log('Original data:', data[6]);

  data[6] = 'const parseTime   = require(\'m3u8stream/dist/parse-time\');';

  console.log('Edited data:', data[6]);

  data = data.join('\n');

  fs.writeFile('../../node_modules/ytdl-core/lib/index.js', data, err => {
    if(err) throw err;
    console.log('Edited node_modules/ytdl-core/lib/index.js');
  });
});

fs.readFile('../../node_modules/ytdl-core/lib/info-extras.js', (err, data) => {
  if(err) throw err;
  data = data.toString();
  data = data.split('\n');

  console.log('Original data:', data[4]);

  data[4] = 'const parseTime   = require(\'m3u8stream/dist/parse-time\');';

  console.log('Edited data:', data[4]);

  data = data.join('\n');

  fs.writeFile('../../node_modules/ytdl-core/lib/info-extras.js', data, err => {
    if(err) throw err;
    console.log('Edited node_modules/ytdl-core/lib/info-extras.js');
  });
});