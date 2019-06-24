# Contributing
If you wish to contribute to the bot's codebase or documentation, feel free to fork the repository and submit a pull request. I use eslint to enforce a consistent coding style, so having that set up in your editor of choice will probably be a good idea.

## Setup
1. Fork this repository, then clone your version of it
2. Run `npm i` or `yarn` *
3. Code till you drop
4. Submit a pull request<br>

⚠️ You may have an issue with node-opus. It's particularly hard to build. 
* For Linux/Mac: You need `make`, `autoconf`, `g++`, and `libtool`. Run `npm i` or `yarn` again.
  * Ubuntu: Just run `sudo sh ./src/util/build-node-opus.sh`
* For Windows:
  1. Make sure you have the [Visual Studio C++ addon](https://download.microsoft.com/download/5/f/7/5f7acaeb-8363-451f-9425-68a90f98b238/visualcppbuildtools_full.exe)
  2. node-gyp is an issue, currently. [Here's how to fix it.](https://github.com/nodejs/node-gyp/issues/1753#issuecomment-501827267)
  3. Run `npm i` or `yarn` again.