import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { Game, Types } from 'phaser';
import { HomeScene } from './scenes/home/HomeScene';
import { LobbyScene } from './scenes/lobby/LobbyScene';
import { PreloaderScene } from './scenes/PreloaderScene';

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  scene: [BootScene, PreloaderScene, HomeScene, LobbyScene],
};

export default new Game(config);
