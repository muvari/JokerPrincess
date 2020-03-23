const Server = require('boardgame.io/server').Server;
const LoveLetter = require('./LoveLetter').LoveLetter;
const server = Server({ games: [LoveLetter] });
server.run(8000, () => console.log("server running..."));