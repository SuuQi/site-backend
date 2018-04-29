require('babel-register')({
    ignore: /node_modules\/(?!koa-static|koa-send|site-middle-layer)/
});
require('babel-polyfill');

const app = require('./app.js').default;
const server = require('http').createServer(app.callback());

server.listen(process.env.PORT || 9000);
