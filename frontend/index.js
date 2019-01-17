
let coins = 10000, rtpPerc = 0, delay = 0; 

let results = [], rtpArr = [];
let width = 0;


function onLoad() {
	document.getElementById('result').innerHTML = coins;
	document.getElementById('rtp').style.visibility = 'hidden';
}

function onBet(type) {

	let snd = new Audio("content/cash.wav");

	delay = 0;

	if (type === 'normal')
	{
		moveCoins('-10', type);
		coins -= 10;

		document.getElementById('result').innerHTML = coins;
		
		results = getResult();

		coins += results[0];

		

		if(results[0] === 20) {

			delay += 2500;

			setTimeout(() => {
				document.getElementById('current').style.animation = 'fadeOut 1s';
				document.getElementById('current_img').style.animation = 'fadeOut 1s';
				document.getElementById('free').style.animation = 'fadeOut 1s';
			}, 1500);
				
			setTimeout(() => {
				snd.play();
				moveCoins('20', type);
				document.getElementById('result').innerHTML = coins;
			}, 2500);

		}

	}
	else if (type === 'free')
	{
		results = getResult();

		if(results[0] === 20) {

			snd.play();
			moveCoins('20', type);
		}
		coins += results[0];

		document.getElementById('result').innerHTML = coins;
	}

	setTimeout(() => {
		document.getElementById('current').style.animation = 'fadeOut 1s';
		document.getElementById('current_img').style.animation = 'fadeOut 1s';
		document.getElementById('free').style.animation = 'fadeOut 1s';
	}, delay + 1500);

	if(results[1])
	{
		setTimeout(() => {
			document.getElementById('current').textContent = '';
			document.getElementById('free').textContent = '';
			document.getElementById('current_img').style.visibility = 'hidden';
			onBet('free');
		}, delay + 2500);
	}
	else {
		setTimeout(() => {
			document.getElementById('current').textContent = '';
			document.getElementById('free').textContent = '';
			document.getElementById('current_img').style.visibility = 'hidden';
		}, delay + 2500);
	}
}

function onRtp() {

	let elem = document.getElementById('bar'); 
	document.getElementById('game').parentNode.removeChild(document.getElementById('game'));
	document.getElementById('progress-text').textContent = 'RTP simulation';
	document.getElementById('rtp').style.visibility = 'visible';

	let timerId = setInterval(getUserRtp, 1000);
	setTimeout(() => { 
		clearInterval(timerId);
		let maxVal = Math.max(...rtpArr).toFixed(2);
		let arrAvg = rtpArr.reduce((a,b) => a + b, 0) / rtpArr.length;
		document.getElementById('rtp-result').textContent = 'RTP result: ' + arrAvg.toFixed(2) + '%';

		document.getElementById('bar').textContent = '';
		document.getElementById('bar').style.backgroundColor = 'rgb(18, 83, 18)';
		document.getElementById('progress-text').textContent = `Best result: ${maxVal*50000} coins won out of 500000 bets (RTP ${maxVal}%).`;
		document.getElementById('progress-text').style.fontSize = '25px';
		elem.style.width = width + '%'; 

	}, 20500);
}

function moveCoins(coin, type) {
	if(coin === '-10') {
		document.getElementById('current_img').src = '../content/onecoin.jpg';
		document.getElementById('current_img').style.visibility = 'visible';
		document.getElementById('current').textContent = '- 10';
		document.getElementById('current').style.color = 'red';
		document.getElementById('current').style.animation = 'fadeUp 1.5s 1.5';
		document.getElementById('current_img').style.animation = 'fadeUp 1.5s 1.5';
	}
	else if(coin === '20') {
		document.getElementById('current_img').src = '../content/twocoins.jpg';
		document.getElementById('current_img').style.visibility = 'visible';
		document.getElementById('current').textContent = '+ 20';
		document.getElementById('current').style.color = 'green';
		document.getElementById('current').style.marginLeft = '25px';
		document.getElementById('current').style.animation = 'fadeUp 1.5s 1.5';
		document.getElementById('current_img').style.animation = 'fadeUp 1.5s 1.5';
		if(type === 'free')
		{
			document.getElementById('free').textContent = 'Free Round!';
			document.getElementById('free').style.animation = 'fadeIn 1.5s 1';
		}
		else 
		{
			document.getElementById('free').textContent = 'Win!';
			document.getElementById('free').style.animation = 'fadeIn 1.5s 1';
		}
	}
}

function onBackToGame() {
	document.getElementById('rtp').style.visibility = 'hidden';
	location.reload();
}

function getResult() {
	let coins, isFree;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let resultObj = JSON.parse(xhttp.responseText);
			coins = resultObj.coins;
			isFree = resultObj.freeGame;
			console.log(resultObj.num);
		}
	};

	xhttp.open('GET', '/bet', false);
	xhttp.send();

	return [coins, isFree];
}

function getUserRtp() {
	let elem = document.getElementById('bar'); 
	console.log('start function');
	width += 5;
	rtpPerc = 0;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let resultObj = JSON.parse(xhttp.responseText);
			rtpPerc = resultObj.result;
		}
	};

	xhttp.open('GET', '/rtp', false);
	xhttp.send();

	rtpArr.push(rtpPerc);

	elem.style.width = width + '%';
	elem.textContent = Math.round(width) + '%';
	document.getElementById('rtp-result').textContent = 'Current RTP: ' + rtpPerc.toFixed(2) + '%';
}
