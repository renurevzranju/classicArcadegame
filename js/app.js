'use strict';
/**---------------------------SOUND--------------------------------**/
var bug = new Audio('sounds/bug.wav');
var collect = new Audio('sounds/collect.mp3');
/**---------------------------ENEMY VARIABLE--------------------------------**/
var Enemy = function(xPos, yPos, speed) {
    /** Variables applied to each of our instances go here,
    *we've provided one for you to get started
    *The image/sprite for our enemies, this uses
    *a helper we've provided to easily load images**/
    this.xStart = xPos;
    this.yStart = yPos;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

/** Update the enemy's position, required method for game
    Parameter: dt, a time delta between ticks**/
Enemy.prototype.update = function(dt) {
    /**You should multiply any movement by the dt parameter
    which will ensure the game runs at the same speed for all computers.**/
    if (this.xStart >= 505){
       this.xStart = -(Math.floor((Math.random() * 5) + 1) * 101);
        this.yStart = Math.floor((Math.random() * 3) + 1) * 83;
    } else {
        this.xStart = this.xStart + (this.speed * dt);
    }
    /**Collision Check**/
    collisionDetection(this);
};

/**Draw the enemy on the screen, required method for game**/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xStart, this.yStart);
};

/**----------------------------------PLAYER VARIABLE-----------------------------**/
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-horn-girl.png';
    this.points = 0;
    this.lives = 5;   
};

Player.prototype.update = function() {
    /**check if player runs into left, bottom, or right canvas walls
    prevent player from moving beyond canvas wall boundaries**/
    if (this.y > 383 ) {
        this.y = 383;
    }
    if (this.x > 402.5) {
        this.x = 402.5;
    }
    if (this.x < 2.5) {
        this.x = 2.5;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    /*If player has reach the water, reset his location to the origin and 
    *increment runs completed counter by one
    */
    if (this.y <= 0) {
        this.points += 1;
        this.y = 404;
    };
};

Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left') {
        this.x -= this.speed;
    }
    if (keyPress == 'up') {
        this.y -= this.speed - 20;
    }
    if (keyPress == 'right') {
        this.x += this.speed;
    }
    if (keyPress == 'down') {
        this.y += this.speed - 20;
    }
};

Player.prototype.reset = function() {
        this.x = 202;
        this.y = 415;
        if (this.lives === 1) {
            alert("!!!!!!!!!!!!!!GAME OVER!!!!!!!!!!! \n ********You Score: " + this.points);
            location.reload();
        }else {
        this.lives = this.lives - 1;
    }
};

/**--------------------DISPLAYING COLLECTIBLE ITEMS---------------------------**/
var Items = function() {
    var img = [
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/Heart.png',
        'images/Key.png'
    ];

    this.points = Math.floor(Math.random() *5);
    this.sprite = img[this.points];
    this.multiplier = 2 * (this.points + 1);

    this.xPosition = 0 + (101 * Math.floor(Math.random() * 5));
    this.yPosition = 63 + (83 * Math.floor(Math.random() * 3));
};

Items.prototype.update = function() {
    ItemCollision();
};

Items.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.xPosition, this.yPosition);
};

/**----------------------COLLISION DETECTION---------------**/
var collisionDetection = function(anEnemy) {
    /** check for collision between enemy and player **/
    if (player.y + 131 >= anEnemy.yStart + 90
        && player.x + 25 <= anEnemy.xStart + 88
        && player.y + 73 <= anEnemy.yStart + 135
        && player.x + 76 >= anEnemy.xStart + 11) {
        bug.play();
        console.log('Collided');
        player.reset();
    }
};

var ItemCollision = function() {
    if (player.y + 131 >= items.yPosition + 90
        && player.x + 25 <= items.xPosition + 88
        && player.y + 73 <= items.yPosition + 135
        && player.x + 76 >= items.xPosition + 11) {
        collect.play();
        player.points += items.multiplier;
        items = null;
        items = new Items();
    }
};

/**---------------------------------------------------------------------------**/
var items = new Items();
var player = new Player(202.5, 383, 80);
var firstbug = new Enemy(0, Math.random() * 184 + 50, Math.floor((Math.random() * 100) + 500));
var secondbug = new Enemy(0, Math.random() * 184 + 50, Math.floor((Math.random() * 100) + 800));
var thirdbug = new Enemy(0, Math.random() * 184 + 50, Math.floor((Math.random() * 100) + 600));
var fourthbug = new Enemy(0, Math.random() * 184 + 50, Math.floor((Math.random() * 200) + 100));
var allEnemies = [firstbug, secondbug, thirdbug, fourthbug];
/**This listens for key presses and sends the keys to your
    Player.handleInput() method. You don't need to modify this.**/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right', 
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});