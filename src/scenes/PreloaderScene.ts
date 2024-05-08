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
    this.load.image(ImageKeyEnum.Loading, 'assets/images/loading.png');
    this.load.image(ImageKeyEnum.LobbyBg, 'assets/images/lobby_bg.jpg');
    this.load.image(ImageKeyEnum.StarIcon, 'assets/images/star.png');
    this.load.image(ImageKeyEnum.EnterIcon, 'assets/images/enter.png');
    this.load.image(ImageKeyEnum.AcceptIcon, 'assets/images/accept.png');
    this.load.image(ImageKeyEnum.DeleteIcon, 'assets/images/delete.png');
    this.load.image(ImageKeyEnum.GameBg, 'assets/images/game_bg.jpg');
    this.loadCards();
  }

  create(): void {
    this.scene.start(SceneKeyEnum.GameScene);
  }

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.BootBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createLoadingText(): void {
    this.add
      .text(this.mainCenterX, this.mainCenterY + 130, 'Carregando...', {
        fontFamily: 'ArianHeavy',
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

  private loadCards(): void {
    this.load.image(ImageKeyEnum.Card2OfClubs, 'assets/images/cards/2_of_clubs.png');
    this.load.image(ImageKeyEnum.Card3OfClubs, 'assets/images/cards/3_of_clubs.png');
    this.load.image(ImageKeyEnum.CardBack1, 'assets/images/cards/back_1.png');
  }
}
