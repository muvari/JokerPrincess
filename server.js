// const Koa = require('koa');
const Server = require('boardgame.io/server').Server;
const LoveLetter = require('./src/LoveLetter').LoveLetter;
const server = Server({ games: [LoveLetter] });
server.app.use(require('koa-static')('./build'));
server.run(8000, () => console.log("server running..."));