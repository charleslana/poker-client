import { ImageKeyEnum } from '@enum/ImageKeyEnum';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@enum/SceneKeyEnum';

export class BootScene extends Scene {
  constructor() {
    super(SceneKeyEnum.BootScene);
  }

  preload(): void {
    this.load.image(ImageKeyEnum.BootBg, 'assets/images/boot_bg.jpg');
  }

  create(): void {
    this.scene.start(SceneKeyEnum.PreloaderScene);
  }
}
