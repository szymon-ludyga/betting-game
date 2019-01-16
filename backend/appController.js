
let coinsWon = 0;
let totalBet = 0, totalWin = 0, num = 0;
let freeGame = false;

let getRandomResult = () => {
	coinsWon = 0;
	freeGame = false;
	evaluate('normal');
	return { free: freeGame, coins: coinsWon, num: num};
};

let getRtp = () => {
	totalBet = 0;
	totalWin = 0;
	for(let i = 0; i < 500000; i++)
	{
		totalBet += 10;
		evaluate('rtp');
	}
	return { win: totalWin, bet: totalBet};
};


let evaluate = (type) => {
	num = Math.floor(Math.random()*20);
	if(num < 5)
	{
		coinsWon = 20;
		totalWin += 20;
		freeGame = false;
	}
	else if (num === 5)
	{
		coinsWon = 20;
		totalWin += 20;
		freeGame = true;
		if (type  === 'rtp')
		{
			evaluate('rtp');
		}
	}
	else if (num === 6)
	{
		coinsWon = 0;
		freeGame = true;
		if (type  === 'rtp')
		{
			evaluate('rtp');
		}
	}
	else {
		coinsWon = 0;
		freeGame = false;
	}
};


module.exports = {
	getRandomResult, getRtp
};