import Phaser from 'phaser';

var config = {
    width: 1000,
    height: 700,
    type: Phaser.AUTO,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                //y: 500
            }
        }
    }
};

var game = new Phaser.Game(config);

var posX = 100;
var posY = 200;
var characterView = "front";
const characterWidth = 42;
const characterHeight = 70;
const characterVelocity = 2;

function preload() {
    this.load.image("character-front", "./public/assets/character/front/1.png");
    this.load.image("character-back", "./public/assets/character/back/1.png");
    this.load.image("character-left", "./public/assets/character/left/1.png");
    this.load.image("character-right", "./public/assets/character/right/1.png");
    this.load.image("map", "./public/assets/background.jpg");
}

function create() {
    this.add.image(0, 0, 'map').setOrigin(0);
    this.character = this.physics.add.image(posX, posY, "character-front");
    this.cursor = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
    keyEvents(this);
    //var color = this.textures.getPixel(this.character.x, this.character.y, 'map');
    //console.log(color);
}

function keyEvents(game) {
    if (game.cursor.right.isDown) {
        if (verifyMove('x', game, 1)) game.character.x += characterVelocity;
        updateCharacterView(game, "right");
    }
    if (game.cursor.left.isDown) {
        if (verifyMove('x', game, -1)) game.character.x -= characterVelocity;
        updateCharacterView(game, "left");
    }
    if (game.cursor.up.isDown) {
        if (verifyMove('y', game, -1)) game.character.y -= characterVelocity;
        updateCharacterView(game, "back");
    }
    if (game.cursor.down.isDown) {
        if (verifyMove('y', game, 1)) game.character.y += characterVelocity;
        updateCharacterView(game, "front");
    }
}

function updateCharacterView(game, orientation) {
    if (characterView !== orientation) {
        game.character.setTexture("character-" + orientation);
        characterView = orientation;
    }
}

function verifyMove(axis, game, dir) {
    var move = true;
    if (axis === 'x') {
        for (var i = game.character.y - (characterHeight / 2); i < game.character.y + (characterHeight / 2); i++) {
            const color = game.textures.getPixel(game.character.x + (((characterWidth / 2) + characterVelocity) * dir), i, 'map');
            if (color.r === 0 && color.g === 0 && color.b === 0) {
                move = false;
                break;
            }
        }
    } else if (axis == 'y') {
        for (var i = game.character.x - (characterWidth / 2); i < game.character.x + (characterWidth / 2); i++) {
            const color = game.textures.getPixel(i, game.character.y + (((characterHeight / 2) + characterVelocity) * dir), 'map');
            if (color.r === 0 && color.g === 0 && color.b === 0) {
                move = false;
                break;
            }
        }
    }
    return move;
}