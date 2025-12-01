/// <reference path="jsgame.js" />
/// <reference path="jsclasses.js" />
/// <reference path="jsglobal.js" />

var flagValid = true;
var playersArr = [];
var playerName;
var isNew = false;

//פונקציה המאתחלת את הדף
function Init() {

    playersArr = JSON.parse(localStorage.getItem("PlayersNames"));
    //אתחול תיבת הselect של שמות השחקנים הקיימי
    var select_box = document.getElementById("existingPlayer");
    if (playersArr == null) { // אם לא נשמרו שחקנים במערכת
        playersArr = [];
        document.getElementById("existingPlayer").style.display = "none";
        document.querySelector("#addNewPlayer").style.display = "none";
        document.querySelector("#newPlayer").style.display = "inline";
    }
    else {
        for (var i = 0; i < playersArr.length; i++) {
            var an_option = document.createElement("option");
            an_option.id = "op_" + (i + 1);
            an_option.value = playersArr[i];
            an_option.textContent = playersArr[i];
            select_box.appendChild(an_option);
        }
    }
    // הצגת תמונות הרקע על המסך לבחירה
    var img_div = document.querySelector("#image-options");
    for (var i = 1; i < 5; i++) {
        // התווית 
        var my_label = document.createElement("label");
        my_label.className = "label_option";

        // הרדיו בעצמו
        var radio_button = document.createElement("input");
        radio_button.type = "radio";
        radio_button.name = "image";
        radio_button.value = "background" + i;
        radio_button.className = "radio_option";

        // הוספת הרדיו לתווית
        my_label.appendChild(radio_button);

        // התמונה שבתוך התווית
        var my_image = document.createElement("img");
        my_image.src = "../Images/background/רקע" + i + ".jpg";
        my_image.alt = "רקע " + i;
        my_image.className = "back_img";

        // הוספת התמונה לתווית
        my_label.appendChild(my_image);

        // הוספת התווית ל-div
        img_div.appendChild(my_label);
    }
}

//פונקציה לגילוי והסתרת הטקסטבוקס של הוספת שחקן
var dis_text = false
function discoverTextBox() {
    var txt = document.querySelector("#newPlayer");
    if (!dis_text) {
        txt.style.display = "inline";
        txt.focus();
    }
    else {
        txt.style.display = "none";
    }
    dis_text = !dis_text;
}
//פונקציה המחברת בין הrange ל textBox שלו
function ChangeRange(this_, id_to_change) {
    if (parseInt(this_.value, 10) > 180 || parseInt(this_.value, 10) < 30) {
        var valid = document.getElementById("validationRangeTime");
        valid.textContent = "טווח לא תקין";
        valid.style.display = "block";
        flagValid = false;
    }
    else {
        var valid = document.getElementById("validationRangeTime");
        valid.style.display = "none";
        document.getElementById(id_to_change).value = this_.value;
        flagValid = true;
    }
}

//בודקת אם השם שהוכנס כבר קיים ברשימת השחקנים
function isNameExists(name) {
    for (var i = 0; i < playersArr.length; i++) {
        if (playersArr[i] == name) {
            return true;
        }
    }
    return false;
}
//מעדכנת את התוכן התצוגה של הספן עליו מוצגות הערות של בדיקות תקינות
function updatErrorSpan(theSpan, massage, displayCondition) {
    theSpan.textContent = massage;
    theSpan.style.display = displayCondition;
}
//מעדכנת את המשתנים הגלובלים שבראש העמוד
function updateFlagsPlayer(valid, ifnew, player) {
    flagValid = valid;
    isNew = ifnew;
    playerName = player;
}
function NameValidation(name) {
    if (name.length >= 2) {
        return true;
    }
    return false;
}

//בדיקת תקינות ושמירה של שם השחקן
function validPlayer() {
    //רבקי-- אפשר להוסיף בדיקה של אורך השם
    var op = document.getElementById("existingPlayer").options;
    var selected_option = op.selectedIndex;
    var new_player = document.getElementById("newPlayer");
    var valid = document.getElementById("validationPlayer");
    if (selected_option == 0) {     //אם לא נבחר שחקן קיים
        if (new_player.value == "") {       //אם לא הוכנס שחקן חדש
            updatErrorSpan(valid, "לא נבחר שחקן", "block");
            flagValid = false;
        }
        else {
            //אם הוכנס שחקן חדש צריך לשמור אותו לטווח הארוך
            if (isNameExists(new_player.value)) {
                if (confirm("השחקן " + new_player.value + " כבר קיים במערכת.\nהאם אתה רוצה לבחור בשחקן הזה? ")) {
                    updateFlagsPlayer(true, false, new_player.value);
                }
                else {
                    flagValid = false;
                    new_player.value = '';
                    new_player.focus();
                }
            }
            else {
                if (NameValidation(new_player.value)) {
                    updateFlagsPlayer(true, true, new_player.value);
                    updatErrorSpan(valid, "", "none");
                    playersArr.push(playerName); // שמור את שם השחקן החדש במערך הגלובלי של שמות השחקנים
                    localStorage.PlayersNames = JSON.stringify(playersArr); // שמור את רשימת שמות השחקנים המעודכנת בלוקל סטורג
                }
                else {
                    flagValid = false;
                    updatErrorSpan(valid, "השם שהוכנס קצר מידי - שם שחקן צריך להכיל יותר מתו אחד", "block");
                }
            }
        }
    }
    else {      //אם נבחר שחקן קיים צריך לשמור אותו בשביל המשחק הנוכחי
        if (new_player.value != "") {       //אם הוכנס שחקן חדש
            updatErrorSpan(valid, "לא ניתן לבחור שחקן קיים ולהוסיף שחקן חדש בו זמנית", "block");
            flagValid = false;
        }
        else {
            updateFlagsPlayer(true, false, op[selected_option].value);
        }
    }
}

function levelSelected() {
    var levelArr = document.getElementsByName("levels");
    for (var i = 0; i < levelArr.length; i++) {
        if (levelArr[i].checked) {
            return i + 1;
        }
    }
}

function bckgrdSelected() {
    var bckgrdArr = document.querySelectorAll(".radio_option");
    if (bckgrdArr[0].checked) {
        return getRandomInt(1, 4);
    }
    for (var i = 1; i < bckgrdArr.length; i++) {
        if (bckgrdArr[i].checked) {
            return i;
        }
    }
}

//פונקציה ששומרת את נתוני המשחק ועוברת לדף המשחק
function startGame() {
    validPlayer();
    if (flagValid) {
        var t = document.getElementById("balloonRange").value;
        var l = levelSelected();
        var b = "../Images/background/רקע" + bckgrdSelected() + ".jpg";
        var n = isNew;
        var curr_Game = new GameClass(playerName, t, l, b, n);
        sessionStorage.setItem("Game", JSON.stringify(curr_Game));
        window.location.href = "Game.html";
    }

}