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
    this.load.image(ImageKeyEnum.ChipsIcon, 'assets/images/chips.png');
    this.load.image(ImageKeyEnum.StarOwnerIcon, 'assets/images/owner.png');
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
    this.loadClubsCards();
    this.loadDiamondsCards();
    this.loadHeartsCards();
    this.loadSpadesCards();
    this.load.svg(ImageKeyEnum.CardBack, 'assets/images/cards/back.svg');
  }

  private loadClubsCards(): void {
    this.load.svg(ImageKeyEnum.Card2OfClubs, 'assets/images/cards/2_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card3OfClubs, 'assets/images/cards/3_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card4OfClubs, 'assets/images/cards/4_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card5OfClubs, 'assets/images/cards/5_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card6OfClubs, 'assets/images/cards/6_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card7OfClubs, 'assets/images/cards/7_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card8OfClubs, 'assets/images/cards/8_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card9OfClubs, 'assets/images/cards/9_of_clubs.svg');
    this.load.svg(ImageKeyEnum.Card10OfClubs, 'assets/images/cards/10_of_clubs.svg');
    this.load.svg(ImageKeyEnum.CardJackOfClubs, 'assets/images/cards/jack_of_clubs.svg');
    this.load.svg(ImageKeyEnum.CardQueenOfClubs, 'assets/images/cards/queen_of_clubs.svg');
    this.load.svg(ImageKeyEnum.CardKingOfClubs, 'assets/images/cards/king_of_clubs.svg');
    this.load.svg(ImageKeyEnum.CardAceOfClubs, 'assets/images/cards/ace_of_clubs.svg');
  }

  private loadDiamondsCards(): void {
    this.load.svg(ImageKeyEnum.Card2OfDiamonds, 'assets/images/cards/2_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card3OfDiamonds, 'assets/images/cards/3_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card4OfDiamonds, 'assets/images/cards/4_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card5OfDiamonds, 'assets/images/cards/5_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card6OfDiamonds, 'assets/images/cards/6_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card7OfDiamonds, 'assets/images/cards/7_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card8OfDiamonds, 'assets/images/cards/8_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card9OfDiamonds, 'assets/images/cards/9_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.Card10OfDiamonds, 'assets/images/cards/10_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.CardJackOfDiamonds, 'assets/images/cards/jack_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.CardQueenOfDiamonds, 'assets/images/cards/queen_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.CardKingOfDiamonds, 'assets/images/cards/king_of_diamonds.svg');
    this.load.svg(ImageKeyEnum.CardAceOfDiamonds, 'assets/images/cards/ace_of_diamonds.svg');
  }

  private loadHeartsCards(): void {
    this.load.svg(ImageKeyEnum.Card2OfHearts, 'assets/images/cards/2_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card3OfHearts, 'assets/images/cards/3_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card4OfHearts, 'assets/images/cards/4_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card5OfHearts, 'assets/images/cards/5_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card6OfHearts, 'assets/images/cards/6_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card7OfHearts, 'assets/images/cards/7_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card8OfHearts, 'assets/images/cards/8_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card9OfHearts, 'assets/images/cards/9_of_hearts.svg');
    this.load.svg(ImageKeyEnum.Card10OfHearts, 'assets/images/cards/10_of_hearts.svg');
    this.load.svg(ImageKeyEnum.CardJackOfHearts, 'assets/images/cards/jack_of_hearts.svg');
    this.load.svg(ImageKeyEnum.CardQueenOfHearts, 'assets/images/cards/queen_of_hearts.svg');
    this.load.svg(ImageKeyEnum.CardKingOfHearts, 'assets/images/cards/king_of_hearts.svg');
    this.load.svg(ImageKeyEnum.CardAceOfHearts, 'assets/images/cards/ace_of_hearts.svg');
  }

  private loadSpadesCards(): void {
    this.load.svg(ImageKeyEnum.Card2OfSpades, 'assets/images/cards/2_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card3OfSpades, 'assets/images/cards/3_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card4OfSpades, 'assets/images/cards/4_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card5OfSpades, 'assets/images/cards/5_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card6OfSpades, 'assets/images/cards/6_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card7OfSpades, 'assets/images/cards/7_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card8OfSpades, 'assets/images/cards/8_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card9OfSpades, 'assets/images/cards/9_of_spades.svg');
    this.load.svg(ImageKeyEnum.Card10OfSpades, 'assets/images/cards/10_of_spades.svg');
    this.load.svg(ImageKeyEnum.CardJackOfSpades, 'assets/images/cards/jack_of_spades.svg');
    this.load.svg(ImageKeyEnum.CardQueenOfSpades, 'assets/images/cards/queen_of_spades.svg');
    this.load.svg(ImageKeyEnum.CardKingOfSpades, 'assets/images/cards/king_of_spades.svg');
    this.load.svg(ImageKeyEnum.CardAceOfSpades, 'assets/images/cards/ace_of_spades.svg');
  }
}
