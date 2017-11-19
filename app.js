"use strict";
/**
 * entrance js
 */
const express = require('express');
const app = express();
const config = require('./config');

app.listen(config.port, function(){
    console.log(`Express server start & listening on port : ${config.port}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`NODE VERSION: ${process.version}`);

    // 全局异常捕捉
    process.on('uncaughtException', function (err) {
        console.error(`Caught exception: ${err}`);
    });
});

module.exports = require('http').createServer(app);


global.ROOT = __dirname;

app.set('views', ['./views']);
app.set('view engine', 'ejs');

//middlewares
const session = require('express-session');

//布局母版中间件
app.use(require('express-ejs-layouts'));
// 用于简单表单 parsing application/x-www-form-urlencoded，比如一般文本提交
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());
// 用于 parsing multipart/form-data 表单，比如上传
app.use(require('multer')());
app.use(require('cookie-parser')());
app.use(session({
	//session 数据库存储
	store: new require('connect-redis')(session)({
		client:require('./lib/redis-client').getSessionClient(),
		prefix: config.expressSession.redis.prefix,
		ttl: config.expressSession.redis.ttl,
	}),
	key: config.expressSession.key,
	secret: config.expressSession.secret,
	resave: config.expressSession.resave,
	saveUninitialized: config.expressSession.saveUninitialized,
	cookie: config.expressSession.cookie
}));


//设置静态文件路径
app.use('/static', express.static('./static'));

//middleware
app.use(require('./middlewares/attach-common-function'));

// 访问日志
app.use('/',(req, res, next) => {
	console.log(`${req.method} ${req.url} `);
	console.log( 'IP ', req.headers['x-forwarded-for']);
	console.log( 'UA ', req.get("User-Agent") );
	console.log( 'Referrer ', req.get("Referrer") );
	next();
});
app.use('/', require('./middlewares/login-session').attachSession);

app.use('/', require('./routes/index'));

// 错误处理
app.use('/', require('./middlewares/error'));