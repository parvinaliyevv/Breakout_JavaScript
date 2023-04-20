class HtmlElement {
    constructor(id, width, height, color) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    create() {
        let div = document.createElement("div");
        div.id = this.id;
        
        document.body.append(div);
        this.show();
    }

    show() {
        this.elem = document.getElementById(this.id);
        
        this.elem.style.width = this.width + "px";
        this.elem.style.height = this.height + "px";
        this.elem.style.background = this.color;
    }
}

class CornerHtmlElement extends HtmlElement {
    constructor(id, width, height, color, corner) {
        super(id, width, height, color);

        this.corner = corner;
    }

    show() {
        super.show();

        this.elem.style.borderRadius = this.corner;
    }
}

class AnimatedHtmlElement extends CornerHtmlElement {
    constructor(id, width, height, color, corner, posX, posY, speedX, speedY) {
        super(id, width, height, color, corner);

        this.posX = posX;
        this.posY = posY;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    create() {
        let div = document.createElement("div");
        div.id = this.id;

        game.elem.append(div);
        this.show(1);
    }

    show(state = 0) {
        if (state) super.show();

        this.elem.style.left = this.posX + "px";
        this.elem.style.top = this.posY + "px";
    }
}

class Ball extends AnimatedHtmlElement {
    move() {
        if (this.posX < 0 || this.posX > game.width - this.width) this.speedX *= -1;

        if (this.posY > game.height - this.height) gameOver();
        else if (this.posY < 0 || this.posY + this.height > bar.posY &&
            this.posX + this.width >= bar.posX && this.posX <= bar.posX + bar.width) {

            this.speedY *= -1;
            if (this.posX + this.width <= bar.posX + 5 || this.posX >= bar.posX + bar.width - 5) this.speedX *= -1;
            
            if (this.speedY > 0 && this.speedY < 20) this.speedY++;
            else if (this.speedY < 0 && this.speedY > -20) this.speedY--;
        }
        else {
            for (let i = 0; i < bricks.row * bricks.column; i++) {
                let brick = bricks.arr[i];

                if (brick.status &&
                    this.posX + this.width >= brick.posX && this.posX <= brick.posX + brick.width &&
                    this.posY + this.height >= brick.posY && this.posY <= brick.posY + brick.height) {

                    this.speedY *= -1;

                    if (this.posX + this.width <= brick.posX + 5 || this.posX >= brick.posX + brick.width - 5) this.speedX *= -1;

                    brick.status = false;

                    bricks.show();

                    break;
                }
            }
        }

        this.posX += this.speedX;
        this.posY += this.speedY;

        this.show();
    }
}

class Bar extends AnimatedHtmlElement {
    move(e) {
        if (e.type == "mousemove") this.posX = e.pageX - game.elem.offsetLeft - this.width / 2;
        else {
            if (e.keyCode == 37) this.posX -= this.speedX;
            else if (e.keyCode == 39) this.posX += this.speedX;
        }

        if (this.posX < 0) this.posX = 0;
        else if (this.posX > game.width - this.width) this.posX = game.width - this.width;

        super.show();
    }
}

let game = new HtmlElement("game", 800, 600, "ghostwhite");
let ball = new Ball("ball", 30, 30, "red", "50%", 50, game.height / 2, 5, 5);
let bar = new Bar("bar", 150, 20, "aquamarine", "4px", 50, game.height - 25, 10, 0);

const bricks = {
    row: 3,
    column: 5,
    gap: 10,
    arr: [],

    create() {
        for (let i = 0; i < bricks.row; i++) {
            for (let j = 0; j < bricks.column; j++) {
                let brick = new function () {
                    this.id = `b${i}${j}`;
                    this.width = (game.width - bricks.gap * (bricks.column + 1)) / bricks.column;
                    this.height = this.width / 5;
                    this.posX = (j + 1) * bricks.gap + j * this.width;
                    this.posY = (i + 1) * bricks.gap + i * this.height;
                    this.color = "deepskyblue";
                    this.status = true;
                }

                let div = document.createElement("div");
                div.id = brick.id;

                game.elem.append(div);
                bricks.arr.push(brick);
            }
        }

        this.show();
    },

    show() {

        end = true;

        for (let i = 0; i < this.column * this.row; i++) {
            let brick = this.arr[i];

            if (brick.status) {
                brick.elem = document.getElementById(brick.id);

                brick.elem.style.width = brick.width + "px";
                brick.elem.style.height = brick.height + "px";
                brick.elem.style.left = brick.posX + "px";
                brick.elem.style.top = brick.posY + "px";
                brick.elem.style.background = brick.color;

                end = false;
            }
            else {
                brick.elem.style.background = "transparent";
            }
        }

        if (end) gameWon();
    }
}

function gameWon() {
    clearInterval(ballTimer);
    alert("game won!");
}

function gameOver() {
    clearInterval(ballTimer);
    alert("Game Over!");
}

game.create();
ball.create();
bar.create();
bricks.create();

let ballTimer = setInterval(function() { ball.move(); }, 40);

document.onkeydown = function(e) { bar.move(e); };
game.elem.onmousemove = function(e) { bar.move(e); };
