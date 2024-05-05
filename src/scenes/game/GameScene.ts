import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';

export class GameScene extends Scene {
  constructor() {
    super(SceneKeyEnum.GameScene);
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0xffffff);
    this.add.text(10, 10, 'GameScene', { color: '#000000' });
  }
}
