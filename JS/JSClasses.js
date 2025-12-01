
var levels = {
    beginner: 1,
    upper: 2,
    master: 3,
};

function GameClass(player, timer, level, backgrd, isNew) {
    this.player = player;//שם שחקן
    this.backgrd = backgrd;
    this.level = level;
    this.timer = timer;
    this.score = 0;
    this.isNew = isNew;
}

function Players(name, count = 0, score = 0) {
    this.name = name;
    this.count = count;
    this.score = score;
    this.checkIsZero = function () {
        if (this["count"] == 0) {
            return true;
        }
        return false;
    }
    this.addScore = function (game) {
        if (this.checkIsZero()) {
            this.score = parseInt(parseInt(game.score)*100 / parseInt(game.timer));
        }
        else {
            this.score = parseInt(((this.score * this.count) + parseInt(game.score*100 / game.timer)) / (this.count + 1));
        }
        this.count += 1;

    }
}
