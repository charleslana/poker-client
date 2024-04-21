import { BootScene } from './scenes/BootScene';
import { Game, Types } from 'phaser';
import { HomeScene } from './scenes/HomeScene';
import { PreloaderScene } from './scenes/PreloaderScene';

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'game-container',
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloaderScene, HomeScene],
};

export default new Game(config);
