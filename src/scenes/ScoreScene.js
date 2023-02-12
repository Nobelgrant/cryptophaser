import BaseScene from "./BaseScene.js";
import Flappy from "../../ethereum/flappy.js";

class ScoreScene extends BaseScene {

  constructor(config) {
    super('ScoreScene',{...config, CanGoBack: true});
  }

  create() {
    super.create();

    this.createScoreScene();
  }

  async createScoreScene() {
    const bestScore =  await Flappy.methods.getPlayerScore().call();
    this.add.text(...this.CenterScreen, `Best Score: ${ bestScore || 0}`, {fontsize: '64px', fill: '#000'}).setOrigin(0.5,1);
  }
  
}

export default ScoreScene;
