'use strict';

let Koa = require('koa');
let logger = require('koa-logger');
let session = require('koa-session');
let bodyParser = require('koa-bodyparser');
let cors = require('koa-cors'); //解决跨域问题中间件
let app = new Koa();

//设置session的key
app.key = ['imooc'];
app.use(logger());
app.use(session(app));
app.use(cors());
app.use(bodyParser());

let router = require('./routers/routes');

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('现在启动了nodejs://localhost:3000');
