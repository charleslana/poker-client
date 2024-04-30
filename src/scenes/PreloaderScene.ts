import * as Phaser from 'phaser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';

export class PreloaderScene extends Scene {
  constructor() {
    super(SceneKeyEnum.PreloaderScene);
  }

  private mainCenterX: number;
  private mainCenterY: number;

  init(): void {
    this.mainCenterX = this.cameras.main.width / 2;
    this.mainCenterY = this.cameras.main.height / 2;
    this.createBg();
    this.createLoadingText();
    this.createProgressBar();
  }

  preload(): void {
    this.load.image(ImageKeyEnum.HomeBg, 'assets/images/home_bg.jpg');
    this.load.image(ImageKeyEnum.CloseIcon, 'assets/images/close_icon.png');
    this.load.image(ImageKeyEnum.DialogRegisterBg, 'assets/images/dialog_register_bg.png');
    this.load.image(ImageKeyEnum.DialogLoginBg, 'assets/images/dialog_login_bg.png');
    this.load.image(ImageKeyEnum.Loading, 'assets/images/loading.png');
    this.load.image(ImageKeyEnum.DialogChangeNameBg, 'assets/images/dialog_change_name_bg.png');
  }

  create(): void {
    this.scene.start(SceneKeyEnum.LobbyScene);
  }

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.BootBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createLoadingText(): void {
    this.add
      .text(this.mainCenterX, this.mainCenterY + 130, 'Carregando...', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);
  }

  private createProgressBar(): void {
    const barWidth = 468;
    const barHeight = 32;
    const progressBarX = this.mainCenterX;
    const progressBarY = this.mainCenterY + barHeight / 2 + 150;
    this.add.rectangle(progressBarX, progressBarY, barWidth, barHeight).setStrokeStyle(2, 0x000000);
    const progressIndicator = this.add.rectangle(
      progressBarX - barWidth / 2 + 4,
      progressBarY,
      4,
      barHeight - 4,
      0xffffff
    );
    this.load.on(Phaser.Loader.Events.PROGRESS, (progress: number) => {
      progressIndicator.width = 4 + (barWidth - 8) * progress;
    });
  }
}
