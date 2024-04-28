import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';

export class LobbyScene extends Scene {
  constructor() {
    super(SceneKeyEnum.LobbyScene);
  }

  create(): void {
    this.add
      .text(0, 0, 'Lobby', {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0);
  }
}
