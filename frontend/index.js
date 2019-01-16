
let coins = 10000, rtpPerc = 0, delay = 0; 

let results = [], rtpArr = [];

function onLoad() {
    document.getElementById("result").innerHTML = coins;
    document.getElementById("rtp").style.visibility = 'hidden';
}

function onBet(type) {

    delay = 0;

    if (type === 'normal')
    {
        moveCoins('-10', type);
        coins -= 10;

        document.getElementById("result").innerHTML = coins;
        
        results = getResult();

        coins += results[0];

        

        if(results[0] === 20) {

            delay += 2500;

            setTimeout(() => {
                document.getElementById("current").style.animation = 'fadeOut 1s';
                document.getElementById("current_img").style.animation = 'fadeOut 1s';
                document.getElementById("free").style.animation = 'fadeOut 1s';
            }, 1500);
                
            setTimeout(() => {
                moveCoins('20', type);
                document.getElementById("result").innerHTML = coins;
            }, 2500);

        }

    }
    else if (type === 'free')
    {
        results = getResult();

        if(results[0] === 20) {
           moveCoins('20', type);
        }
        // else
        // {
        //     moveCoins('0', type);
        // }
        coins += results[0];

        document.getElementById("result").innerHTML = coins;
    }

    setTimeout(() => {
        document.getElementById("current").style.animation = 'fadeOut 1s';
        document.getElementById("current_img").style.animation = 'fadeOut 1s';
        document.getElementById("free").style.animation = 'fadeOut 1s';
    }, delay + 1500);

    if(results[1])
    {
        setTimeout(() => {
            document.getElementById("current").textContent = '';
            document.getElementById("free").textContent = '';
            document.getElementById("current_img").style.visibility = 'hidden';
            onBet('free');
        }, delay + 2500);
    }
    else {
        setTimeout(() => {
            document.getElementById("current").textContent = '';
            document.getElementById("free").textContent = '';
            document.getElementById("current_img").style.visibility = 'hidden';
        }, delay + 2500);
    }
}

function onRtp() {
    document.getElementById("game").parentNode.removeChild(document.getElementById("game"));
    document.getElementById("rtp").style.visibility = 'visible';

    moveBar();

    let timerId = setInterval(getUserRtp, 1000);
    setTimeout(() => { 
        clearInterval(timerId);
        let maxVal = Math.max(...rtpArr);
        console.log(maxVal);
        let arrAvg = rtpArr.reduce((a,b) => a + b, 0) / rtpArr.length;
        document.getElementById("rtp-result").textContent = "RTP result: " + arrAvg.toFixed(2) + '%';
    }, 20500);
}

function moveCoins(coin, type) {
    if(coin === '-10') {
        document.getElementById("current_img").style.visibility = 'visible';
        document.getElementById("current").textContent = '- 10';
        document.getElementById("current").style.color = 'red';
        document.getElementById("current").style.animation = 'fadeUp 1.5s 1';
        document.getElementById("current_img").src = "../images/onecoin.jpg";
        document.getElementById("current_img").style.animation = 'fadeUp 1.5s 1';
    }
    else if(coin === '20') {
        document.getElementById("current_img").style.visibility = 'visible';
        document.getElementById("current").textContent = '+ 20';
        document.getElementById("current").style.color = 'green';
        document.getElementById("current").style.marginLeft = '25px';
        document.getElementById("current").style.animation = 'fadeUp 1.5s 1';
        document.getElementById("current_img").src = "../images/twocoins.jpg";
        document.getElementById("current_img").style.animation = 'fadeUp 1.5s 1';
        if(type === 'free')
        {
            document.getElementById("free").textContent = 'Free Round!';
            document.getElementById("free").style.animation = 'fadeUp 1.5s 1';
        }
    }
}

function onBackToGame() {
    document.getElementById("rtp").style.visibility = 'hidden';
    location.reload();
}

function moveBar() {
    let elem = document.getElementById("bar");   
    let width = 0;
    let id = setInterval(frame, 10);
    function frame() {
      if (width >= 50) {
        clearInterval(id);
        width = 0;
        document.getElementById("bar").textContent = "";
        document.getElementById("progress-text").textContent = "";
        elem.style.width = width + '%'; 
      } else {
        width += 0.025;
        document.getElementById("progress-text").textContent = "Progress";
        elem.textContent = Math.round(width*2) + '%';
        elem.style.width = width + '%'; 
      }
    }
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

    xhttp.open("GET", "/bet", false);
    xhttp.send();

    return [coins, isFree];
}

function getUserRtp() {
    console.log('start function');
    rtpPerc = 0;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let resultObj = JSON.parse(xhttp.responseText);
            rtpPerc = resultObj.result;
        }
    };

    xhttp.open("GET", "/rtp", false);
    xhttp.send();

    rtpArr.push(rtpPerc);
    document.getElementById("rtp-result").textContent = "RTP: " + rtpPerc.toFixed(2) + '%';
}
