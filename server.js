const Server = require('boardgame.io/server').Server;
const LoveLetter = require('./src/LoveLetter/LoveLetter').LoveLetter;
const WitsWagers = require('./src/WitsNWagers/WitsWagers').WitsWagers;
const server = Server({ games: [LoveLetter, WitsWagers] });
server.app.use(require('koa-static')('./build'));
server.run(process.env.PORT || 8000, () => console.log("server running..."));