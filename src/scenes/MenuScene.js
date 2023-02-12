import BaseScene from "./BaseScene.js";
import Flappy from "../../ethereum/flappy.js";

class MenuScene extends BaseScene {

  constructor(config) {
    super('MenuScene',config);

    this.menu = [
      {scene: 'PlayScene', text: 'Play'},
      {scene: 'ScoreScene', text: 'Score'},
      {scene: null, text: 'Exit'},
    ]
  }

  create() {
    super.create();

    this.createMenu(this.menu,this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem){
    const textGO =  menuItem.textGO;

    textGO.setInteractive();
    textGO.on('pointerover', ()=>{
      textGO.setStyle({fill: '#ff0'});
    })

    textGO.on('pointerout', ()=>{
      textGO.setStyle({fill: '#fff'});
    })

    textGO.on('pointerup', ()=>{
      menuItem.scene

      if(menuItem.text == 'Play'){
        Flappy.methods.enter().send({
          from: web3.eth.defaultAccount,
          value: web3.utils.toWei('0.01', 'ether')
        })
        .then(() => {
          console.log('Transaction completed.');
          this.scene.start('PlayScene');
        })
        .catch(error => {
          console.error(error);
        });
      }

      else if(menuItem.tex == 'Score'){
        this.scene.start('ScoreScene');
      }

      else if(menuItem.text == 'Exit'){
        this.game.destroy(true);
      }
    })

  }

}
export default MenuScene;