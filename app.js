const express = require('express');
const app = express();
const morgan = require('morgan');

const controller = require('./backend/appController');

app.use(morgan('dev'));

let port = 3000;

// if (process.env.NODE_ENV != 'test') {
// 	port = process.env.PORT || ENV.port;
// }

app.use('/images', express.static('./images'));
app.use(express.static('./frontend'));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, PUT, DELETE, OPTIONS'
	);
	next();
});

app.get('/bet', function(req, res, next) {
	let result = controller.getRandomResult();
	res.json({freeGame: result.free, coins: result.coins, num: result.num});
});

app.get('/rtp', function(req, res, next) {
	let rtp = controller.getRtp();
	let rtpPerc = rtp.win/rtp.bet*100;
	res.json({result: rtpPerc});
});

app.listen(port);