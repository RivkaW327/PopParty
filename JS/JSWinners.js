/// <reference path="jsclasses.js" />

var arrPlayers = [];

//arrPlayers[0] = JSON.parse(localStorage.getItem("PlayersL1"));
//arrPlayers[1] = JSON.parse(localStorage.getItem("PlayersL2"));
//arrPlayers[2] = JSON.parse(localStorage.getItem("PlayersL3"));

//divLevel1
//divLevel2
//divLevel3
/*#divLevel1 table {
    background: #ff0000;
}*/
//var my_balloon = document.createElement("img"); // יצירת אלמנט מסוג תמונה
//my_balloon.id = "b" + count;
//document.querySelector("#balloonArea").appendChild(my_balloon);

//myTR.appendChild(td1);
//let tableBody = document.querySelector("#myTable tbody");
//tableBody.appendChild(myTR);
function initArrPlayers() {
    arrPlayers[0] = JSON.parse(localStorage.getItem("PlayersL1"));
    arrPlayers[1] = JSON.parse(localStorage.getItem("PlayersL2"));
    arrPlayers[2] = JSON.parse(localStorage.getItem("PlayersL3"));
    for (var i = 0; i < 3; i++) {
        if (arrPlayers[i] == null) {
            arrPlayers[i] = [];
        }
        else {
            arrPlayers[i] = arrPlayers[i].map(playerData => {
                let player = new Players(playerData.name, playerData.count, playerData.score);
                Object.assign(player, playerData);
                return player;
            });
        }
    }

}

function init() {
    var audio = document.createElement("audio");
    var src = document.createElement("source");
    src.src = "../audio/sound_winners.wav"; // נתיב לקובץ השמע
    audio.appendChild(src);
    document.body.appendChild(audio);
    audio.play();
    initArrPlayers();
    var arrName;
    var theLen;
    for (var i = 0; i < 3; i++) {
        arrName = i;
        theLen = returnLen(i);
        showWinners(arrName, theLen);

    }
}

function returnLen(num) {
    if (arrPlayers[num].length < 10) {
        return arrPlayers[num].length;
    }
    return 10;
}

function showWinners(arr, len) {
    var myTR;
    var myTD;
    var contentTD;
    var theTable;
    var elemForQuery;
    for (var j = 0; j < len; j++) {
        myTR = document.createElement("tr");
        myTD1 = document.createElement("td");
        myTD2 = document.createElement("td");
        myTD3 = document.createElement("td");
        contentTD = arrPlayers[arr][j].name;
        myTD1.textContent = contentTD;
        myTR.appendChild(myTD1);
        myTD2.textContent = "|";
        myTR.appendChild(myTD2);
        contentTD = arrPlayers[arr][j].score;
        myTD3.textContent = contentTD;
        myTR.appendChild(myTD3);
        elemForQuery = "#divLevel" + (arr + 1) + " table";
        theTable = document.querySelector(elemForQuery);
        theTable.appendChild(myTR);
    }
}





