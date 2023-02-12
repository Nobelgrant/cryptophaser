import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  constructor(key,config) {
    super(key);
    this.config = config;
    this.CenterScreen = [config.width/2,config.height/2];
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0);

    if(this.config.CanGoBack) {
      const backButton =  this.add.image(this.config.width - 10, this.config.height -10, 'back')
      .setOrigin(1)
      .setScale(2)
      .setInteractive();

      backButton.on('pointerup', () => {
        this.scene.start('MenuScene');
      })
    }
  }

  createMenu(menu, setupMenuEvents) {
    let MenuPositionY = 0;

    menu.forEach(menuItem => {
        const menuPosition = [this.CenterScreen[0], this.CenterScreen[1] + MenuPositionY];
        menuItem.textGO = this.add.text(...menuPosition, menuItem.text, {fontsize: '32px', fill: '#fff'} ).setOrigin(0.5,1);
        MenuPositionY += 42;
        setupMenuEvents(menuItem);
    })
  }

}
export default BaseScene;