const convert = require('convert-units');
module.exports = {
  run: (client, message, args) => {
    const value = args[0];
    let fromUnit = args[1];
    let toUnit = args[2];

    if (!value) return message.send(':x: `|` 🔃 **Missing value to convert from!**');
    if (!fromUnit) return message.send(':x: `|` 🔃 **Missing unit to convert from!**');
    if (!toUnit) return message.send(':x: `|` 🔃 **Missing unit to convert to!**');

    // Since the library I'm using is a fucking idiot, I have to write this myself. Angry 23:03 me writing this.
    function correctCapitalization(x) {
      x = x.toLowerCase().trim();
      return x
        .replace('tbs', 'Tbs')
        .replace('tbs/s', 'Tbs/s')
        .replace(/^c$/, 'C') // RegEx: Matches if c is the *only* letter in x.
        .replace(/^f$/, 'F') // RegEx: Matches if f is the *only* letter in x.
        .replace(/^k$/, 'K') // RegEx: Matches if k is the *only* letter in x.
        .replace(/^r$/, 'R') // RegEx: Matches if r is the *only* letter in x.
        .replace('hz', 'Hz')
        .replace('khz', 'kHz')
        /* Here is where I would have put mhz. Problem: "MHz" and "mHz" exist. */
        .replace('ghz', 'GHz')
        .replace('thz', 'THz')
        .replace('pa', 'Pa')
        .replace('hpa', 'hPa')
        .replace('kpa', 'kPa')
        .replace('mpa', 'MPa')
        .replace(/^b$/, 'B') // RegEx: Matches if b is the *only* letter in x.
        .replace('kb', 'KB')
        .replace('mb', 'MB')
        .replace('gb', 'GB')
        .replace('tb', 'TB')
        .replace(/^v$/, 'V') // RegEx: Matches if v is the *only* letter in x.
        .replace('mv', 'mV')
        .replace('kv', 'kV')
        .replace(/^a$/, 'A') // RegEx: Matches if a is the *only* letter in x.
        .replace('ma', 'mA')
        .replace('ka', 'kA')
        .replace(/^w$/, 'W') // RegEx: Matches if w is the *only* letter in x.
        .replace('mw', 'mW')
        .replace('kw', 'kW')
        .replace('mw', 'MW')
        .replace('gw', 'GW')
        .replace('va', 'VA')
        .replace('kva', 'kVA')
        /* Here is where I would have put mva. Problem: "mVA" and "MVA" exist. */
        .replace('gva', 'GVA')
        .replace('var', 'VAR')
        .replace('mvar', 'mVAR')
        .replace('kvar', 'kVAR')
        .replace('mvar', 'mVAR')
        .replace('gvar', 'gVAR')
        .replace('wh', 'Wh')
        /* Here is where I would have put mwh. Problem: "mWh" and "MWh" exist. */
        .replace('kwh', 'kWh')
        .replace('gwh', 'GWh')
        .replace(/^j$/, 'J') // RegEx: Matches if j is the *only* letter in x.
        .replace('kj', 'kJ')
        .replace('varh', 'VARh')
        /* Here is where I would have put mvarh. Problem: "mVARh" and "MVARh" exist. */
        .replace('kvarh', 'kVARh')
        .replace('gvarh', 'GVARh');
    }

    fromUnit = correctCapitalization(fromUnit);
    toUnit = correctCapitalization(toUnit);

    try { message.send(`🔃 **\`${convert(value).from(fromUnit).to(toUnit)} ${toUnit}\`**`); } catch (e) {
      if (e.message.startsWith('Unsupported unit')) return message.send(':x: `|` 🔃 **One of your units was not supported.** Please try another one.');
      else if (e.message.startsWith('Cannot convert incompatible')) return message.send(':x: `|` 🔃 **Your units cannot be converted from one to the other.** Please try a different combination.');
      else message.send(`:x: **You should not be seeing this.** Error:\n\`\`\`${e.stack}\`\`\``);
    }
  },

  conf: {
    enabled: true,
    permLevel: 'User',
    aliases: [],
    guildOnly: false
  },

  help: {
    name: 'convert',
    description: 'Convert a unit to another unit',
    usage: 'convert <value> <from unit> <to unit>',
    category: 'Misc'
  }
};