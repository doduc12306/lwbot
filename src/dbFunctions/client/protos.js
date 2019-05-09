module.exports = () => {
  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following few methods
  // are, we feel, very useful in code.

  // <String>.toProperCase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  };

  // <String>.replaceAll() returns a string that replaces all of a specific text, for example:
  // "Welcome to the server, {{user}}! Please have a fun time here, {{user}}!" returns "server, @User! ... here, @User!"
  String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
  };

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  // <Number>.isEven()/.isOdd() returns a boolean if it's even or odd, respectively
  Number.prototype.isEven = function(n) {
    return (this || n) % 2 == 0;
  };
  Number.prototype.isOdd = function(n) {
    return Math.abs((this || n) % 2) == 1;
  };
};