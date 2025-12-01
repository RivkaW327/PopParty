/// <reference path="jsglobal.js" />
/// <reference path="jshome.js" />
/// <reference path="showtimer.js" />

//ירוק תכלת כחול סגול אדום וורוד
var colors = ['#9cbb70', '#70caaa', '#1091bb', '#cc3f96', '#c81950', '#f8a9c5'];

var currGame = JSON.parse(sessionStorage.getItem("Game"));
var audio = document.createElement("audio");
var src = document.createElement("source");
src.src = "../audio/musicccc.mp3";
src.type = "audio/mpeg";
audio.loop = true;
var isPlayed = false;
var music = false;

function init() {
    currGame.score = 0;
    document.querySelector("#welcome").textContent = "שלום " + currGame.player;
    document.querySelector("#divGame").style.backgroundImage = "url(" + currGame.backgrd + ")";
    initArrPlayers();
}

function playMusic() {
    m = document.getElementById("m1");
    if (!music) {
        m.src = "../Images/Icon/volume-full-regular-24.png";
        if (isPlaying) {
            audio.appendChild(src);
            document.body.appendChild(audio);
            audio.play();
        }
    }
    else {
        m.src = "../Images/Icon/volume-mute-regular-24.png";
        if (isPlaying) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
    music = !music;
}
function speedBalloons() {
    switch (currGame.level) {
        case 1:
            return 32;
        case 2:
            return 23;
        case 3:
            return 18;
        default:
            return 32;
    }
}

function frequencyBalloons() {
    switch (currGame.level) {
        case 1:
            return 750;
        case 2:
            return 700;
        case 3:
            return 650;
        default:
            return 750;
    }
}

var speedMoveBallon = speedBalloons();
var frequencyAddBalloon = frequencyBalloons();


var timerSpeedBallon;
var timerFrequencyBalloon;

var count = 0; // סופר כמה בלונים נוצרו עד עכשיו
// פונקציה שיוצרת בלון
function CreateBalloon() {
    count++;
    var window_width = document.getElementById("balloonArea").clientWidth;
    var window_height = document.getElementById("balloonArea").clientHeight;
    var my_balloon = document.createElement("img"); // יצירת אלמנט מסוג תמונה
    var b_width = getRandomInt(50, 100); // הגרלת רוחב לתמונה
    var balloon_ID = getRandomInt(1, 6); // הגרלת התמונה בעצמה
    var b_location = Math.random() * (window_width - b_width); // הגרלת מיקום ל-left של התמונה
    my_balloon.setAttribute("src", "../Images/Balloons/בלון_" + balloon_ID + ".png");
    my_balloon.id = "b" + count;
    my_balloon.style.width = b_width + "px";
    my_balloon.style.position = "absolute";
    my_balloon.style.left = b_location + "px";
    my_balloon.style.bottom = "0px"; // מיקום הבלון בתחתית ה-div
    my_balloon.setAttribute("data-score", 120 - b_width);
    my_balloon.setAttribute("data-timerSpeedBallon", "");
    my_balloon.onclick = function () { popBalloon(my_balloon.id) };
    my_balloon.className = "balloons";
    document.querySelector("#balloonArea").appendChild(my_balloon);

    moveBalloon(my_balloon.id); // קריאה לפונקציה moveBalloon לאחר יצירת הבלון
}


// פונקציה שמזיזה את הבלון
function moveBalloon(balloon_id) {
    var balloon = document.getElementById(balloon_id);
    var current_left = parseInt(balloon.style.left, 10);
    var current_top = parseInt(balloon.style.bottom, 10);
    var current_width = parseInt(balloon.style.width, 10);
    var dir = getRandomInt(-4, 4);
    var timerSpeedBallon = setInterval(function () {
        current_left = parseInt(balloon.style.left, 10);
        current_left += dir;
        balloon.style.left = current_left + "px";
        if ((current_left + current_width >= document.getElementById("balloonArea").clientWidth) || (current_left <= 0)) {
            dir = -dir;
        }
        current_top = parseInt(balloon.style.bottom, 10);
        current_top += 1;
        balloon.style.bottom = current_top + "px";
        if (current_top >= document.getElementById("balloonArea").clientHeight) {
            balloon.remove();
            clearInterval(timerSpeedBallon);
        }
    }, speedMoveBallon);
    balloon.setAttribute("data-timerSpeedBallon", timerSpeedBallon)
}

//שתי פונקציות עזר לפיצוץ

function ifClickBalloonItself(balloon_id) {
    var balloon = document.getElementById(balloon_id);
    var computedStyle = window.getComputedStyle(balloon);
    var height = computedStyle.height;//גובה הבלון
    var rect = balloon.getBoundingClientRect();//קבלת מיקום הבלון
    var cur_top = rect.top;
    if (event.pageY <= (cur_top + parseInt(height, 10) / 2)) {
        return true;
    }
    return false;

}

function disappearBalloon(balloon_id) {
    var balloon = document.getElementById(balloon_id);
    balloon.onclick = null;//לביטול ארוע הלחיצה על האלמנט

    var rect = balloon.getBoundingClientRect();//קבלת מיקום הבלון
    var cur_left = rect.left;
    var cur_top = rect.top;
    var curr_width = rect.width;

    popAnimation(balloon_id);
    //הקטנת הבלון לחצי מגודלו
    var width = parseInt(balloon.style.width, 10);
    var timer_balloon_shrinking = setInterval(function () {
        width -= 5;
        if (width <= 25) {
            clearInterval(timer_balloon_shrinking);
            balloon.parentNode.removeChild(balloon);//מחיקת הבלון
        }
        balloon.style.width = width + "px";
    }, 10);
}


// פונקציה שמפוצצת את הבלון
function popBalloon(balloon_id) {
    var balloon = document.getElementById(balloon_id);
    //הקוד הבא יהיה רק אם לחצו על הבלון ולא על החוט
    if (ifClickBalloonItself(balloon_id)) {
        //הוספת נקודות
        var addScore = parseInt(balloon.getAttribute("data-score"), 10);
        currGame.score += parseInt(addScore);
        document.getElementById("showScore").textContent = currGame.score;
        if (music) {
            // יצירת אלמנט audio והשמעת הצליל
            var audio = document.createElement("audio");
            var src = document.createElement("source");
            src.src = "../audio/sound_pop.mp3"; // נתיב לקובץ השמע
            audio.appendChild(src);
            document.body.appendChild(audio);
            audio.play();

            // האזנה לסיום ההשמעה ומחיקת אלמנט ה-audio
            audio.addEventListener("ended", function () {
                document.body.removeChild(audio);
            });
        }
        //מחיקת האלמנט
        disappearBalloon(balloon_id);
    }
}
function popAnimation(ballonId) {
    // הגדרת משתנים
    var emitter = document.getElementById(ballonId),
        container = document.createElement("div"),
        emitterSize = 100,
        dotQuantity = 15,  // הפחתת מספר העיגולים
        dotSizeMax = 30,
        dotSizeMin = 10,
        speed = 1,
        gravity = 1,
        index = parseInt(emitter.src.slice(-5), 10) - 1, // חילוץ אינדקס מתוך ballonId
        explosionColor = colors[index % colors.length]; // קביעת צבע מתוך המערך

    // הגדרת סגנונות הקונטיינר
    container.style.cssText = "position:absolute; left:0; top:0; overflow:visible; z-index:5000; pointer-events:none;";
    document.body.appendChild(container);

    // יצירת האנימציה של הפיצוץ
    function createExplosion(container) {
        var dots = [];
        var angle, length, dot, i, size;

        for (i = 0; i < dotQuantity; i++) {
            dot = document.createElement("div");
            dot.className = "dot";
            size = getRandom(dotSizeMin, dotSizeMax);
            container.appendChild(dot);
            angle = Math.random() * Math.PI * 2;
            length = Math.random() * (emitterSize / 2 - size / 2);

            // הגדרת מיקום ראשוני של הנקודה
            dot.style.position = 'absolute';
            dot.style.width = size + 'px';
            dot.style.height = size + 'px';
            dot.style.borderRadius = '50%'; // הופך את הנקודות לעיגולים
            dot.style.backgroundColor = explosionColor; // צבע אחיד
            dot.style.left = (Math.cos(angle) * length) + 'px';
            dot.style.top = (Math.sin(angle) * length) + 'px';

            // הוספת שקיפות רנדומלית
            dot.style.opacity = getRandom(0.5, 1);

            dots.push({ dot: dot, angle: angle, length: length, size: size });
        }

        return function () {
            var startTime = null;

            function animate(time) {
                if (!startTime) startTime = time;
                var elapsed = (time - startTime) / 1000; // זמן שעבר בשניות

                dots.forEach(({ dot, angle, length, size }) => {
                    var progress = elapsed * speed;
                    var x = Math.cos(angle) * length * (1 + progress * 2);
                    var y = Math.sin(angle) * length * (1 + progress * 2);
                    var opacity = parseFloat(dot.style.opacity) - progress * 0.5;

                    if (opacity <= 0) {
                        dot.remove();
                    } else {
                        dot.style.left = x + 'px';
                        dot.style.top = y + 'px';
                        dot.style.opacity = opacity;
                    }
                });

                if (dots.length > 0) {
                    requestAnimationFrame(animate);
                }
            }

            requestAnimationFrame(animate);
        };
    }

    // פיצוץ של אלמנט
    function explode(element) {
        var bounds = element.getBoundingClientRect();
        container.style.left = (bounds.left + bounds.width / 2) + 'px';
        container.style.top = (bounds.top + bounds.height / 2) + 'px';

        var explosion = createExplosion(container);
        explosion();
    }

    // פונקציות עזר
    function getRandom(min, max) {
        return min + Math.random() * (max - min);
    }

    // הפעלת הפיצוץ בהתחלה וגם כשקליקים על האלמנט
    explode(emitter);
    emitter.onmousedown = emitter.ontouchstart = function () {
        explode(emitter);
    };

    // גרירת האלמנט
    emitter.style.position = 'absolute';
    emitter.style.cursor = 'move';
    emitter.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var shiftX = e.clientX - emitter.getBoundingClientRect().left;
        var shiftY = e.clientY - emitter.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            emitter.style.left = pageX - shiftX + 'px';
            emitter.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(e) {
            moveAt(e.pageX, e.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        emitter.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            emitter.onmouseup = null;
        };
    });
}



var flagIsPlayedYet = false;
var isPlaying = false;
var startTime;
var endTime;
// פונקצית התחלת וניהול המשחק
function ClickPlayBalloon() {
    startTime = Date.now;
    if (flagIsPlayedYet) {
        if (isPlaying) {
            var conf = confirm("אם תעצור את המשחק לא תוכל להמשיך אותו, האם אתה רוצה לעצור?");
            if (conf) {//להוסיף אפשרות לעצור את הטיימר
                endTime = Date.now;
                stopThisGame(0);
                isPlaying = false;
                audio.pause();
                audio.currentTime = 0;
            }
            else {
                endTime = Date.now;
            }
        }
    }
    else {
        isPlaying = true;
        flagIsPlayedYet = true;
        startTimer(currGame.timer);
        timerFrequencyBalloon = setInterval(function () {
            CreateBalloon();
        }, frequencyAddBalloon);
        var seconds = (currGame.timer) * 1000;
        if (music == true) {
            // יצירת אלמנט audio והשמעת הצליל
            audio.appendChild(src);
            document.body.appendChild(audio);
            audio.play();
        }
        setTimeout('stopThisGame()', seconds);
    }
}

//function stopThisGame(s) {
function stopThisGame() {
    isPlaying = false;
    // איפוס הטיימר
    if (timerInterval) {
        clearInterval(timerInterval); // עצור את ה-interval
    }

    const timerElement = document.getElementById('showTime');
    if (timerElement) {
        timerElement.textContent = "00:00"; // איפוס התצוגה ל-00:00
    }
    audio.pause();
    clearInterval(timerFrequencyBalloon);

    var arrBalloons = document.querySelectorAll(".balloons");
    for (var i = 0; i < arrBalloons.length; i++) {
        arrBalloons[i].onclick = null;
        var timerID = arrBalloons[i].getAttribute("data-timerSpeedBallon");
        if (timerID) {
            clearInterval(parseInt(timerID));
        }
    }
}


var arrPlayers = [, ,];

function initArrPlayers() {
    arrPlayers[0] = JSON.parse(localStorage.getItem("PlayersL1"));
    arrPlayers[1] = JSON.parse(localStorage.getItem("PlayersL2"));
    arrPlayers[2] = JSON.parse(localStorage.getItem("PlayersL3"));
    if (arrPlayers[currGame.level - 1] == null) {
        arrPlayers[currGame.level - 1] = [];
    }
    else {
        arrPlayers[currGame.level - 1] = arrPlayers[currGame.level - 1].map(playerData => {
            let player = new Players(playerData.name, playerData.count, playerData.score);
            Object.assign(player, playerData);
            return player;
        });

    }
}



//הוספת שחקן חדש ללוקל סטורג
function addNewPlayer() {
    var p = new Players(currGame.player);
    p.addScore(currGame);
    arrPlayers[currGame.level - 1].push(p);
    arrPlayers[currGame.level - 1].sort(function (a, b) { return b.score - a.score });
    localStorage["PlayersL" + currGame.level] = JSON.stringify(arrPlayers[currGame.level - 1]);
}
//עדכון פרטי שחקן בלוקל סטורג
function updatePlayer(i) {
    arrPlayers[currGame.level - 1][i].addScore(currGame);
    localStorage["PlayersL" + currGame.level] = JSON.stringify(arrPlayers[currGame.level - 1]);
}

//החזרה של מיקום השחקן במערך אם אינו קיים מחזיר -1
function exsitingPlayerIndex(name) {
    for (var i = 0; i < arrPlayers[currGame.level - 1].length; i++) {
        if (arrPlayers[currGame.level - 1][i].name == name) {
            return i;
        }
    }
    return -1;
}

//שמירת המשחק כחלק מהניקוד
function saveGameDetails() {
    if (arrPlayers[currGame.level - 1] != null) {
        var i = exsitingPlayerIndex(currGame.player);
        if (i != -1) {
            updatePlayer(i);
        }
        else {
            addNewPlayer();
        }
    }
    else {
        addNewPlayer();
    }
}


//בלחיצה על כפתור למשחק חדש עם אותם פרטים
function newGame() {
    if (isPlaying) {
        var conf = confirm("אם תעצור את המשחק לא תוכל להמשיך אותו, האם אתה רוצה לעצור?");
        if (conf) {
            stopThisGame(0); //תעצור את המשחק
            if (flagIsPlayedYet) {
                saveGameDetails(); //תשמור את פרטי המשחק
                location.reload(true); //טען את הדף מחדש
            }
        }
    }
    else {
        if (flagIsPlayedYet) {
            saveGameDetails(); //תשמור את פרטי המשחק
        }
        location.reload(true); //טען את הדף מחדש
    }
}


//להתחיל משחק חדש עם הגדרות חדשות או למעבר לדף האלופים.
function stopGameGoPage(page) {
    if (isPlaying) {
        var conf = confirm("אם תעצור את המשחק לא תוכל להמשיך אותו, האם אתה רוצה לעצור?");
        if (conf) {
            stopThisGame(0); //תעצור את המשחק
        }
    }
    if (flagIsPlayedYet) {
        saveGameDetails(); //תשמור את פרטי המשחק
    }
    if (!isPlaying) {
        window.location = page; //עבור לדף המבוקש
    }
}


