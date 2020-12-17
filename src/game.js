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

function preload() {
    this.load.image("character-front", "./public/assets/character/front/1.png");
    this.load.image("character-back", "./public/assets/character/back/1.png");
    this.load.image("character-left", "./public/assets/character/left/1.png");
    this.load.image("character-right", "./public/assets/character/right/1.png");
}

function create() {
    this.character = this.physics.add.image(posX, posY, "character-front");
    // Mouse Events
    this.input.keyboard.on("keydown_RIGHT", () => {
        console.log(this.character);
        this.character.setAcceleration(100,0);
        if(characterView !== "right"){
            this.character.setTexture("character-right");
            characterView = "right";
        }
    });

    this.input.keyboard.on("keyup_RIGHT", () => {
        this.character.setAcceleration(0,0);
        this.character.setVelocity(0);
    });
}

function update(time, delta) {
}

function mouseEvents() {
    console.log(game);
    game.input.keyboard.on("keydown_RIGHT", () => {
        game.character.setAcceleration(100,0);
        if(characterView !== "right"){
            game.character = game.physics.add.image(app.posX, app.posY, "character-right");
            characterView = "right";
        }
    });

    game.input.keyboard.on("keyup_RIGHT", () => {
        game.character.setAcceleration(0,0);
        game.character.setVelocity(0);
    });
}