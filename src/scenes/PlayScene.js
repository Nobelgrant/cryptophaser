
import BaseScene from './BaseScene.js';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {

  constructor(config) {
    super('PlayScene',config);

    this.bird = null;
    this.pipes = null;

    this.pipeHorizontalDistance = 0;
    this.flapVelocity = 300;
    this.score = 0;
    this.scoreText = '';

    this.currentDifficulty = 'easy';
    this.difficulties = {
      'easy': {
        pipeVerticalDistanceRange: [150, 200],
        pipeHorizontalDistanceRange: [300, 350]
      },
      'normal': {
        pipeVerticalDistanceRange: [140, 190],
        pipeHorizontalDistanceRange: [280, 330]
      },
      'hard': {
        pipeVerticalDistanceRange: [120, 150],
        pipeHorizontalDistanceRange: [250, 300]
      }
    }
  }

  create() {
    this.currentDifficulty = 'easy';
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.handleInputs();

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', {start: 8, end: 15}),
      frameRate: 8,
      repeat: -1
    })

    this.bird.play('fly');
  }

  update() {
    this.checkGameStatus();
    this.recyclePipes();
  }

  createBG() {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setFlipX(true).setScale(3).setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe)
    }

    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore')
    this.scoreText = this.add.text( 16, 16, `Score: ${0}`, {fontsize: '32px', fill: '#000'});
    this.add.text( 16, 48, `Best Score: ${ bestScore || 0}`, {fontsize: '32px', fill: '#000'});
  }


  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);
  }

  checkGameStatus() {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
      this.gameOver();
    }
  }

  placePipe(uPipe, lPipe) {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    })
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(function(pipe) {
      rightMostX = Math.max(pipe.x, rightMostX);
    })

    return rightMostX;
  }

  saveBestScore(){
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if(!bestScore || this.score > bestScore){
        localStorage.setItem('bestScore', this.score);
    }
  }

  increaseDifficulty() {
    if(this.score === 2){
      this.currentDifficulty = 'normal';
    }
    else if(this.score === 4){
      this.currentDifficulty = 'hard';
    }
  }

  gameOver() {
    this.physics.pause();
    this.bird.setTint(0xEE4824);
    this.saveBestScore();

    this.time.addEvent({
        delay: 1000,
        callback: () =>{
            this.scene.restart();
        },
        loop: false
    })
  }

  flap() {
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;