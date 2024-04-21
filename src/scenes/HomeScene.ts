import { ImageKeyEnum } from '../enum/ImageKeyEnum';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '../enum/SceneKeyEnum';

export class HomeScene extends Scene {
  constructor() {
    super(SceneKeyEnum.HomeScene);
  }

  init(): void {
    this.createBg();
  }

  preload(): void {}

  create(): void {}

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.HomeBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }
}
