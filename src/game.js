import Phaser from 'phaser';

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.F,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
    },
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
    this.cameras.main.setBounds(0, 0, 3927, 1904);
    this.add.image(0, 0, 'map').setOrigin(0);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(posX, posY);

    this.character = this.physics.add.image(posX, posY, "character-front");
    this.cursor = this.input.keyboard.createCursorKeys();
    fullscreenEvent(this);
}

function update(time, delta) {
    keyEvents(this);
}

function fullscreenEvent(game) {
    var FKey = game.input.keyboard.addKey('F');
    FKey.on('down', function () {

        if (game.scale.isFullscreen) {
            game.scale.stopFullscreen();
        }
        else {
            game.scale.startFullscreen();
        }

    }, game);
}

function keyEvents(game) {
    if (game.cursor.right.isDown) {
        if (verifyMove('x', game, 1)) {
            game.character.x += characterVelocity;
            game.cameras.main.centerOnX(game.character.x);
        }
        updateCharacterView(game, "right");
    }
    if (game.cursor.left.isDown) {
        if (verifyMove('x', game, -1)) {
            game.character.x -= characterVelocity;
            game.cameras.main.centerOnX(game.character.x);
        }
        updateCharacterView(game, "left");
    }
    if (game.cursor.up.isDown) {
        if (verifyMove('y', game, -1)) {
            game.character.y -= characterVelocity;
            game.cameras.main.centerOnY(game.character.y);
        }
        updateCharacterView(game, "back");
    }
    if (game.cursor.down.isDown) {
        if (verifyMove('y', game, 1)) {
            game.character.y += characterVelocity;
            game.cameras.main.centerOnY(game.character.y);
        }
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