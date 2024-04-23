import * as Phaser from 'phaser';
import { ImageKeyEnum } from '../enum/ImageKeyEnum';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '../enum/SceneKeyEnum';

export class PreloaderScene extends Scene {
  constructor() {
    super(SceneKeyEnum.PreloaderScene);
  }

  private centerX: number;
  private centerY: number;

  init(): void {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.createBg();
    this.createLoadingText();
    this.createProgressBar();
  }

  preload(): void {
    this.load.image(ImageKeyEnum.HomeBg, 'assets/images/home_bg.jpg');
    this.load.image(ImageKeyEnum.CloseIcon, 'assets/images/close_icon.png');
    this.load.image(ImageKeyEnum.DialogBg, 'assets/images/dialog_bg.png');
    this.loadPlugin();
  }

  create(): void {
    this.scene.start(SceneKeyEnum.HomeScene);
  }

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.BootBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createLoadingText(): void {
    this.add
      .text(this.centerX, this.centerY + 130, 'Carregando...', {
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
    const progressBarX = this.centerX;
    const progressBarY = this.centerY + barHeight / 2 + 150;
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

  private loadPlugin(): void {
    this.load.plugin('rexinputtextplugin', 'assets/plugins/rexinputtextplugin.min.js', true);
  }
}
