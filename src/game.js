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
var posY = 100;
var characterView = "front";
const characterVelocity = 100;

function preload() {
    this.load.image("character-front", "./public/assets/character/front/1.png");
    this.load.image("character-back", "./public/assets/character/back/1.png");
    this.load.image("character-left", "./public/assets/character/left/1.png");
    this.load.image("character-right", "./public/assets/character/right/1.png");
}

function create() {
    this.character = this.physics.add.image(posX, posY, "character-front");
    mouseEvents(this);
}

function update(time, delta) {
}

function mouseEvents(game) {
    game.input.keyboard.on("keydown_RIGHT", () => {
        game.character.setVelocityX(characterVelocity);
        updateCharacterView(game, "right");
    });

    game.input.keyboard.on("keyup_RIGHT", () => {
        stopCharacter(game.character);
    });

    game.input.keyboard.on("keydown_LEFT", () => {
        game.character.setVelocityX(characterVelocity*(-1));
        updateCharacterView(game, "left");
    });

    game.input.keyboard.on("keyup_LEFT", () => {
        stopCharacter(game.character);
    });

    game.input.keyboard.on("keydown_UP", () => {
        game.character.setVelocityY(characterVelocity*(-1));
        updateCharacterView(game, "back");
    });

    game.input.keyboard.on("keyup_UP", () => {
        stopCharacter(game.character);
    });

    game.input.keyboard.on("keydown_DOWN", () => {
        game.character.setVelocityY(characterVelocity);
        updateCharacterView(game, "front");
    });

    game.input.keyboard.on("keyup_DOWN", () => {
        stopCharacter(game.character);
    });
}

function updateCharacterView(game, orientation){
    if(characterView !== orientation){
        game.character.setTexture("character-"+orientation);
        characterView = orientation;
    }
}

function stopCharacter(character){
    character.setVelocity(0);
}