
var timerInterval;  // משתנה לשמירה על ה-Interval

function startTimer(seconds) {
    // עצור טיימר קיים אם יש
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    const endTime = Date.now() + seconds * 1000; // זמן סיום
    const timerElement = document.getElementById('showTime');

    // עדכון הטיימר כל שנייה
    timerInterval = setInterval(() => {
        const remainingTime = Math.max(0, endTime - Date.now()); // זמן שנותר

        const minutes = Math.floor(remainingTime / 60000);
        const secs = Math.floor((remainingTime % 60000) / 1000);

        // הפוך את הזמן למספרים עם 2 ספרות
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSecs = secs.toString().padStart(2, '0');

        timerElement.textContent = `${formattedMinutes}:${formattedSecs}`;

        // עצור את הטיימר אם הזמן נגמר
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "00:00";
            var im = document.createElement("img");
            im.id = "gameOver";
            im.src = "../Images/Icon/game_over.png";
            im.style.position = "absolute";
            const elementWidth = 700;

            // קבל את רוחב וגובה המסך
            const viewportWidth = window.innerWidth;

            // חשב את הקואורדינטות כך שהאלמנט יהיה במרכז המסך
            const left = (viewportWidth/2) - (elementWidth / 2);
            const top = "20vh";

            // עדכן את המיקום של האלמנט
            im.style.left = `${left}px`;
            document.getElementById("balloonArea").appendChild(im);
            if (music) {
                var audio = document.createElement("audio");
                var src = document.createElement("source");
                src.src = "../audio/sound_gameOver.wav"; // נתיב לקובץ השמע
                audio.appendChild(src);
                document.body.appendChild(audio);
                audio.play();
            }
        }
    }, 1000); // עדכון כל שנייה
}
