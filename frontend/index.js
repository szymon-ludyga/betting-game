
let coins = 10000, rtpPerc = 0, delay = 0, width = 0;
let results = [], rtpArr = [];

let elemBar, elemProgress, elemGame, elemRtp, 
	elemRtpResult, elemWinInfo, elemCurrentCoin, 
	elemImage, elemResult, elemError;

function onLoad() {
	elemRtp = document.getElementById('rtp');
	elemResult = document.getElementById('result');

	elemResult.textContent = coins;
	elemRtp.style.visibility = 'hidden';
}

function onBet(type) {

	let snd = new Audio('content/cash.wav');
	let sndCoin = new Audio('content/coin.wav');

	elemResult = document.getElementById('result');

	delay = 0;

	if (type === 'normal') {
		sndCoin.play();
		moveCoins('-10', type);
		
		coins -= 10;
		elemResult.textContent = coins;
		
		results = getResult();
		coins += results[0];

		if (results[0] === 20) {

			delay += 2500;

			setTimeout(() => {
				changeCoinAnimation('fadeout');
			}, 1500);
				
			setTimeout(() => {
				snd.play();
				moveCoins('20', type);
				elemResult.textContent = coins;
			}, 2500);
		}

	}
	else if (type === 'free') {
		results = getResult();

		if (results[0] === 20) {

			snd.play();
			moveCoins('20', type);
		}
		coins += results[0];

		elemResult.textContent = coins;
	}

	setTimeout(() => {
		changeCoinAnimation('fadeout');
	}, delay + 1500);

	if (results[1]) {
		setTimeout(() => {
			changeCoinAnimation('hide');
			onBet('free');
		}, delay + 2500);
	}
	else {
		setTimeout(() => {
			changeCoinAnimation('hide');
		}, delay + 2500);
	}
}

function moveCoins(coin, type) {
	elemImage = document.getElementById('current_img');
	elemCurrentCoin = document.getElementById('current');
	elemWinInfo = document.getElementById('free');

	if (coin === '-10') {
		elemImage.src = '../content/onecoin.jpg';
		elemImage.style.visibility = 'visible';
		elemCurrentCoin.textContent = '- 10';
		elemCurrentCoin.style.color = 'red';
		elemCurrentCoin.style.animation = 'fadeUp 1.5s 1';
		elemImage.style.animation = 'fadeIn 1.5s 1';
	}
	else if (coin === '20') {
		elemImage.src = '../content/twocoins.jpg';
		elemImage.style.visibility = 'visible';
		elemCurrentCoin.textContent = '+ 20';
		elemCurrentCoin.style.color = 'green';
		elemCurrentCoin.style.marginLeft = '25px';
		elemCurrentCoin.style.animation = 'fadeUp 1.5s 1';
		elemImage.style.animation = 'fadeIn 1.5s 1';
		if (type === 'free') {
			elemWinInfo.textContent = 'Free Round!';
			elemWinInfo.style.animation = 'fadeIn 1.5s 1';
		}
		else {
			elemWinInfo.textContent = 'Win!';
			elemWinInfo.style.animation = 'fadeIn 1.5s 1';
		}
	}
}

function changeCoinAnimation(type) {

	elemWinInfo = document.getElementById('free');
	elemImage = document.getElementById('current_img');
	elemCurrentCoin = document.getElementById('current');

	if (type === 'fadeout') {
		elemCurrentCoin.style.animation = 'fadeOut 1s';
		elemImage.style.animation = 'fadeOut 1s';
		elemWinInfo.style.animation = 'fadeOut 1s';
	} 
	else if (type === 'hide') {

		elemCurrentCoin.textContent = '';
		elemWinInfo.textContent = '';
		elemImage.style.visibility = 'hidden';
	}
}

function getResult() {

	elemGame = document.getElementById('game');
	elemError = document.getElementById('error');

	let coins, isFree;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let resultObj = JSON.parse(xhttp.responseText);
			coins = resultObj.coins;
			isFree = resultObj.freeGame;
		}
		else if (this.status >= 400) {
			elemGame.parentNode.removeChild(elemGame);
			elemError.textContent = 'Error ' + this.status + ': ' + this.statusText + '. Please refresh the page.';
		}
	};

	xhttp.open('GET', '/bet', false);
	xhttp.send();

	return [coins, isFree];
}

function onRtp() {

	elemBar = document.getElementById('bar');
	elemProgress = document.getElementById('progress-text');
	elemGame = document.getElementById('game');
	elemRtp = document.getElementById('rtp');
	elemRtpResult = document.getElementById('rtp-result');

	elemGame.parentNode.removeChild(elemGame);
	elemProgress.textContent = 'RTP simulation';
	elemRtp.style.visibility = 'visible';

	let timerId = setInterval(getUserRtp, 1000);

	setTimeout(() => { 
		clearInterval(timerId);
		let maxVal = Math.max(...rtpArr);
		let arrAvg = rtpArr.reduce((a,b) => a + b, 0) / rtpArr.length;
		elemRtpResult.textContent = 'RTP result: ' + arrAvg.toFixed(2) + '%';

		elemBar.parentNode.removeChild(elemBar);
		elemProgress.textContent = `Best result: ${Math.round(maxVal*50000)} coins won out of 500000 bets (RTP ${maxVal.toFixed(2)}%).`;
		elemProgress.style.fontSize = '33%';
		elemProgress.style.textShadow = '1px 1px 2px rgb(139, 139, 139)';  
	}, 20500);
}

function getUserRtp() {

	elemRtp = document.getElementById('rtp');
	elemBar = document.getElementById('bar');
	elemRtpResult = document.getElementById('rtp-result');
	elemError = document.getElementById('error');

	width += 5;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			let resultObj = JSON.parse(xhttp.responseText);
			rtpPerc = resultObj.result;
		}
		else if (this.status >= 400) {
			elemRtp.parentNode.removeChild(elemRtp);
			elemError.textContent = 'Error ' + this.status + ': ' + this.statusText + '. Please refresh the page.';
		}
	};

	xhttp.open('GET', '/rtp', false);
	xhttp.send();

	rtpArr.push(rtpPerc);

	elemBar.style.width = width + '%';
	elemBar.textContent = Math.round(width) + '%';
	elemRtpResult.textContent = 'Current RTP: ' + rtpPerc.toFixed(2) + '%';
}

function onBackToGame() {

	elemRtp = document.getElementById('rtp');

	elemRtp.style.visibility = 'hidden';
	location.reload();
}
