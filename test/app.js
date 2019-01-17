process.env.NODE_ENV = 'test';

const chai     = require('chai');
const chaiHttp = require('chai-http');

const server = require('../app.js');

const controller = require('../backend/appController');

chai.use(chaiHttp);

require('chai').expect;
chai.should();

describe('Backend controller test suite', function () {

	it('evaluate() function testing ### Should return correct object', function() {
		
		let evaluate = controller.evaluate('normal');
		evaluate.should.have.all.keys('freeGame', 'num', 'coinsWon');
		evaluate.num.should.be.within(0, 19);
		evaluate.coinsWon.should.satisfy(function(result) {
			return result === 0 || result === 20;
		});
		evaluate.freeGame.should.be.a('boolean');
	});

	it('getRandomResult() function testing ### Should return correct object', function() {
		
		let betResult = controller.getRandomResult();
		betResult.should.have.all.keys('free', 'num', 'coins');
		betResult.num.should.be.within(0, 19);
		betResult.coins.should.satisfy(function(result) {
			return result === 0 || result === 20;
		});
		betResult.free.should.be.a('boolean');
	});

	it('getRtp() function testing ### Should return correct object', function() {
		
		let rtpResult = controller.getRtp();
		rtpResult.should.have.all.keys('win', 'bet');
		rtpResult.bet.should.be.equal(5000000);
		rtpResult.win.should.satisfy(function(result) {
			return result > 3300000 && result < 3380000;
		});
	});

});

describe('Server test suite', function () {

	it('/GET/ /testing ### Should receive 200 status code with correct response', function(done) {
		chai.request(server)
			.get('/testing')
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.a('object');
				res.body.should.have.all.keys('test');
				res.body.test.should.be.a('string');
				res.body.test.should.be.equal('testing');
				done();
			});
	});

	it('/GET/ /bet ### Should receive 200 status code with correct response', function(done) {
		chai.request(server)
			.get('/bet')
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.a('object');
				res.body.should.have.all.keys('num', 'coins', 'freeGame');
				res.body.num.should.be.a('number');
				res.body.num.should.be.within(0, 19);
				res.body.coins.should.be.a('number');
				res.body.coins.should.satisfy(function(result) {
					return result === 0 || result === 20;
				});
				res.body.freeGame.should.be.a('boolean');
				done();
			});
	});

	it('/GET/ /rtp ### Should receive 200 status code with correct response', function(done) {
		chai.request(server)
			.get('/rtp')
			.end(function (err, res) {
				res.should.have.status(200);
				res.should.be.a('object');
				res.body.should.have.all.keys('result');
				res.body.result.should.be.a('number');
				res.body.result.should.satisfy(function(result) {
					return result > 65 && result < 68;
				});
				done();
			});
	});
});

