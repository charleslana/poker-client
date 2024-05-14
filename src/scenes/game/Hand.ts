import * as Phaser from 'phaser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';

export class Hand extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.create();
  }

  public firstCard: Phaser.GameObjects.Image;
  public secondCard: Phaser.GameObjects.Image;

  private mainCenterX: number;
  private mainCenterY: number;
  private container: Phaser.GameObjects.Container;
  private defaultRectangle: Phaser.GameObjects.Rectangle;
  private cardsRectangle: Phaser.GameObjects.Rectangle;
  private dealerContainer: Phaser.GameObjects.Container;
  private dealerRectangle: Phaser.GameObjects.Rectangle;
  private blindContainer: Phaser.GameObjects.Container;
  private infoPlayerRectangle: Phaser.GameObjects.Rectangle;
  private winPlayerRectangle: Phaser.GameObjects.Rectangle;
  private winsText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private playerChipsRectangle: Phaser.GameObjects.Rectangle;
  private handRectangle: Phaser.GameObjects.Rectangle;
  private isOwnerRectangle: Phaser.GameObjects.Rectangle;
  private isOwnerImage: Phaser.GameObjects.Image;
  private infoPlayerText: Phaser.GameObjects.Text;
  private infoPlayerChipsText: Phaser.GameObjects.Text;
  private handText: Phaser.GameObjects.Text;

  public hideContainer(): void {
    this.container.setVisible(false);
  }

  public hideCards(): void {
    this.firstCard.setVisible(false);
    this.secondCard.setVisible(false);
  }

  public setContainerPosition(index: number): void {
    const { x, y } = this.createUserTable(index + 1);
    this.container.setPosition(x, y);
  }

  public clearDealer(): void {
    this.dealerContainer.removeAll();
  }

  public clearBlind(): void {
    this.blindContainer.removeAll();
  }

  public changeBlind(blind: 'small' | 'big'): void {
    this.clearBlind();
    if (blind === 'small') {
      this.createSmallBlind();
      return;
    }
    this.createBigBlind();
  }

  public clearPlayerOwner(): void {
    this.container.remove([this.isOwnerRectangle, this.isOwnerImage]);
  }

  public changeUserNamePlayer(username: string): void {
    this.infoPlayerText.setText(username);
  }

  public changePlayerChips(quantity: string): void {
    this.infoPlayerChipsText.setText(quantity);
  }

  public changePlayerHandText(text: string): void {
    this.handText.setText(text.toUpperCase());
  }

  public changeFirstCardImage(image: ImageKeyEnum): void {
    this.firstCard.setTexture(image);
  }

  public changeSecondCardImage(image: ImageKeyEnum): void {
    this.secondCard.setTexture(image);
  }

  public createUserTable(index: number): {
    x: number;
    y: number;
  } {
    switch (index) {
      case 1:
        return { x: this.mainCenterX - 200, y: this.mainCenterY + 250 };
      case 2:
        return { x: this.mainCenterX + 200, y: this.mainCenterY + 250 };
      case 3:
        return { x: this.mainCenterX - 500, y: this.mainCenterY };
      case 4:
        return { x: this.mainCenterX + 550, y: this.mainCenterY };
      case 5:
        return { x: this.mainCenterX - 200, y: this.mainCenterY - 300 };
      case 6:
        return { x: this.mainCenterX + 200, y: this.mainCenterY - 300 };
      default:
        return { x: 0, y: 0 };
    }
  }

  public createFlipEvents(): void {
    this.firstCard.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.flipCard(this.firstCard);
      this.flipCard(this.secondCard);
    });
    this.secondCard.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.flipCard(this.firstCard);
      this.flipCard(this.secondCard);
    });
  }

  public moveChipsToCenter(x: number, y: number, text: Phaser.GameObjects.Text): void {
    const chips = this.scene.add.image(x, y, ImageKeyEnum.ChipsIcon).setScale(0.14).setOrigin(0);
    chips.setPosition(x, y);
    const moveDuration = 500;
    const tableCenterX = this.mainCenterX + 200;
    const tableCenterY = this.mainCenterY - 100;
    this.scene.tweens.add({
      targets: chips,
      x: tableCenterX,
      y: tableCenterY,
      duration: moveDuration,
      onComplete: () => {
        this.fadeOutCard(chips, text);
      },
    });
  }

  public showWinPlayer(): void {
    this.winsText.setVisible(true);
    this.scoreText.setVisible(true);
    this.winPlayerRectangle.setVisible(true);
  }

  public hideWinPlayer(): void {
    this.winsText.setVisible(false);
    this.scoreText.setVisible(false);
    this.winPlayerRectangle.setVisible(false);
  }

  public fadeInCard(card: Phaser.GameObjects.Image): void {
    const fadeInDuration = 500;
    card.setVisible(true);
    card.setAlpha(0);
    this.scene.tweens.add({
      targets: card,
      alpha: 1,
      duration: fadeInDuration,
      ease: 'Linear',
      onComplete: () => {
        console.log('Carta tornada visível');
      },
    });
  }

  private fadeOutCard(chips: Phaser.GameObjects.Image, text: Phaser.GameObjects.Text): void {
    const fadeDuration = 300;
    this.scene.tweens.add({
      targets: chips,
      alpha: 0,
      duration: fadeDuration,
      onComplete: () => {
        text.setText((+text.text + 10).toString());
      },
    });
  }

  private create(): void {
    this.mainCenterX = this.scene.cameras.main.width / 2;
    this.mainCenterY = this.scene.cameras.main.height / 2;
    this.createUserLocation();
    this.createUserCard();
    this.createDealer();
    this.createBlind();
    this.createInfoPlayer();
    this.createPlayerChips();
    this.createPlayerHand();
  }

  private createUserLocation(): void {
    this.container = this.scene.add.container(this.mainCenterX, this.mainCenterY + 200);
    this.defaultRectangle = this.scene.add.rectangle(0, 0, 170, 170, 0xffffff, 0).setOrigin(0.5);
  }

  private createUserCard(): void {
    this.cardsRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX - this.defaultRectangle.displayWidth,
        this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight,
        100,
        100,
        0xff0000,
        0
      )
      .setOrigin(0, 0);
    this.container.add(this.cardsRectangle);
    this.createFirstCard();
    this.createSecondCard();
  }

  private createFirstCard(): void {
    this.firstCard = this.scene.add
      .image(
        this.defaultRectangle.displayOriginX - this.defaultRectangle.displayWidth - 25,
        this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 20,
        ImageKeyEnum.CardBack
      )
      .setScale(0.34)
      .setOrigin(0)
      .setRotation(-0.3);
    this.container.add(this.firstCard);
  }

  private createSecondCard(): void {
    this.secondCard = this.scene.add
      .image(
        this.defaultRectangle.displayOriginX - this.defaultRectangle.displayWidth + 25,
        this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 20,
        ImageKeyEnum.CardBack
      )
      .setScale(0.34)
      .setOrigin(-0.25, 0.25)
      .setRotation(0.3);
    this.container.add(this.secondCard);
  }

  private createDealer(): void {
    this.dealerRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX -
          this.defaultRectangle.displayWidth +
          this.cardsRectangle.displayWidth,
        this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight,
        70,
        50,
        0x0000ff,
        0
      )
      .setOrigin(0);
    this.container.add(this.dealerRectangle);
    this.createDealerContainer();
    this.createDealerButton();
    this.createDealerText();
    this.container.add(this.dealerContainer);
  }

  private createDealerContainer(): void {
    this.dealerContainer = this.scene.add.container(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        4,
      this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 95
    );
  }

  private createDealerButton(): void {
    const dealerButton = this.scene.add.graphics();
    dealerButton.fillStyle(0x6785f7, 1);
    dealerButton.fillRoundedRect(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        3,
      this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 2,
      25,
      25,
      12.5
    );
    dealerButton.lineStyle(2, 0x0e1671);
    dealerButton.strokeRoundedRect(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        2,
      this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 2,
      26,
      26,
      13
    );
    this.dealerContainer.add(dealerButton);
  }

  private createDealerText(): void {
    const dealerText = this.scene.add
      .text(
        this.defaultRectangle.displayOriginX -
          this.defaultRectangle.displayWidth +
          this.cardsRectangle.displayWidth +
          5,
        this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 4.5,
        'D',
        {
          fontFamily: 'ArianHeavy',
          fontSize: '22px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0);
    this.dealerContainer.add(dealerText);
  }

  private createBlind(): void {
    const blindRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX -
          this.defaultRectangle.displayWidth +
          this.cardsRectangle.displayWidth,
        this.defaultRectangle.displayOriginY -
          this.defaultRectangle.displayHeight +
          this.dealerRectangle.displayHeight,
        70,
        50,
        0x008000,
        0
      )
      .setOrigin(0);
    this.container.add(blindRectangle);
    this.createBlindContainer();
    this.createSmallBlind();
    this.createBigBlind();
    this.container.add(this.blindContainer);
  }

  private createBlindContainer(): void {
    this.blindContainer = this.scene.add.container(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        4,
      this.defaultRectangle.displayOriginY -
        this.defaultRectangle.displayHeight +
        this.dealerRectangle.displayHeight +
        95
    );
    this.container.add(this.blindContainer);
  }

  private createSmallBlind(): void {
    const smallBlindButton = this.scene.add.graphics();
    smallBlindButton.fillStyle(0x1db622, 1);
    smallBlindButton.fillRoundedRect(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        3,
      this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 2,
      25,
      25,
      12.5
    );
    smallBlindButton.lineStyle(2, 0x003000);
    smallBlindButton.strokeRoundedRect(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        2,
      this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 2,
      26,
      26,
      13
    );
    this.blindContainer.add(smallBlindButton);
    this.createBlindText('SB');
  }

  private createBigBlind(): void {
    const bigBlindButton = this.scene.add.graphics();
    bigBlindButton.fillStyle(0xff4602, 1);
    bigBlindButton.fillRoundedRect(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        3,
      this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 2,
      25,
      25,
      12.5
    );
    bigBlindButton.lineStyle(2, 0x781a0f);
    bigBlindButton.strokeRoundedRect(
      this.defaultRectangle.displayOriginX -
        this.defaultRectangle.displayWidth +
        this.cardsRectangle.displayWidth +
        2,
      this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 2,
      26,
      26,
      13
    );
    this.blindContainer.add(bigBlindButton);
    this.createBlindText('BB');
  }

  private createBlindText(text: string): void {
    const blindText = this.scene.add
      .text(
        this.defaultRectangle.displayOriginX -
          this.defaultRectangle.displayWidth +
          this.cardsRectangle.displayWidth +
          4,
        this.defaultRectangle.displayOriginY - this.defaultRectangle.displayHeight + 8.5,
        text,
        {
          fontFamily: 'ArianHeavy',
          fontSize: '13px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0);
    this.blindContainer.add(blindText);
  }

  private createInfoPlayer(): void {
    this.infoPlayerRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX - this.defaultRectangle.displayWidth,
        this.defaultRectangle.displayOriginY -
          this.defaultRectangle.displayHeight +
          this.cardsRectangle.displayHeight,
        100,
        35,
        0x00a200,
        1
      )
      .setOrigin(0)
      .setStrokeStyle(2, 0x000000);
    this.container.add(this.infoPlayerRectangle);
    this.createWinPlayerRectangle();
    this.createInfoPlayerText();
    this.createOwnerPlayerRectangle();
  }

  private createWinPlayerRectangle(): void {
    this.winPlayerRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX - this.defaultRectangle.displayWidth + 10,
        this.defaultRectangle.displayOriginY -
          this.defaultRectangle.displayHeight +
          this.cardsRectangle.displayHeight -
          25,
        80,
        30,
        0xeb7b00,
        1
      )
      .setOrigin(0)
      .setStrokeStyle(2, 0x000000);
    this.container.add(this.winPlayerRectangle);
    this.createWinPlayerText();
  }

  private createWinPlayerText(): void {
    this.winsText = this.scene.add
      .text(
        this.winPlayerRectangle.x + this.winPlayerRectangle.width / 2,
        this.winPlayerRectangle.y + this.winPlayerRectangle.height / 2 - 7,
        'Wins',
        { fontFamily: 'ArianHeavy', fontSize: '16px', color: '#ffffff' }
      )
      .setOrigin(0.5);
    this.scoreText = this.scene.add
      .text(
        this.winPlayerRectangle.x + this.winPlayerRectangle.width / 2,
        this.winPlayerRectangle.y + this.winPlayerRectangle.height / 2 + 5,
        '7.5',
        { fontFamily: 'ArianHeavy', fontSize: '16px', color: '#ffffff' }
      )
      .setOrigin(0.5);
    const maxTextWidth = this.winPlayerRectangle.width * 0.9;
    this.adjustFontSizeToFit(this.winsText, maxTextWidth);
    this.adjustFontSizeToFit(this.scoreText, maxTextWidth);
    this.container.add([this.winsText, this.scoreText]);
  }

  private createInfoPlayerText(): void {
    this.infoPlayerText = this.scene.add.text(
      this.infoPlayerRectangle.x + this.infoPlayerRectangle.width / 2,
      this.infoPlayerRectangle.y + this.infoPlayerRectangle.height / 2,
      'User1',
      { fontFamily: 'ArianHeavy', fontSize: '16px', color: '#ffffff' }
    );
    this.infoPlayerText.setOrigin(0.5);
    const maxTextWidth = this.infoPlayerRectangle.width * 0.9;
    this.adjustFontSizeToFit(this.infoPlayerText, maxTextWidth);
    this.container.add(this.infoPlayerText);
  }

  private createOwnerPlayerRectangle(): void {
    this.isOwnerRectangle = this.scene.add
      .rectangle(this.infoPlayerRectangle.x, this.infoPlayerRectangle.y, 35, 35, 0x000000, 0)
      .setOrigin(1, 0);
    this.isOwnerImage = this.scene.add
      .image(
        this.isOwnerRectangle.x - this.isOwnerRectangle.width / 2,
        this.isOwnerRectangle.y + this.isOwnerRectangle.height / 2,
        ImageKeyEnum.StarOwnerIcon
      )
      .setScale(0.05)
      .setOrigin(0.5);
    this.container.add([this.isOwnerRectangle, this.isOwnerImage]);
  }

  private createPlayerChips(): void {
    this.playerChipsRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX - this.defaultRectangle.displayWidth,
        this.defaultRectangle.displayOriginY -
          this.defaultRectangle.displayHeight +
          this.cardsRectangle.displayHeight +
          this.infoPlayerRectangle.displayHeight,
        100,
        35,
        0x0043ff,
        1
      )
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0);
    this.container.add(this.playerChipsRectangle);
    this.createPlayerChipsText();
    this.createChips();
  }

  private createPlayerChipsText(): void {
    this.infoPlayerChipsText = this.scene.add
      .text(
        this.playerChipsRectangle.x + this.playerChipsRectangle.width / 2,
        this.playerChipsRectangle.y + this.playerChipsRectangle.height / 2,
        '1000',
        { fontFamily: 'ArianHeavy', fontSize: '16px', color: '#ffffff' }
      )
      .setOrigin(0.5);
    const maxTextWidth = this.playerChipsRectangle.width * 0.9;
    this.adjustFontSizeToFit(this.infoPlayerChipsText, maxTextWidth);
    this.container.add(this.infoPlayerChipsText);
  }

  private createChips(): void {
    const chipsImageRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX -
          this.defaultRectangle.displayWidth +
          this.infoPlayerRectangle.displayWidth,
        this.defaultRectangle.displayOriginY -
          this.defaultRectangle.displayHeight +
          this.cardsRectangle.displayHeight,
        70,
        70,
        0xffd700,
        0
      )
      .setOrigin(0);
    this.container.add(chipsImageRectangle);
    this.createChipsImage();
  }

  private createChipsImage(): void {
    const chips = this.scene.add
      .image(
        this.defaultRectangle.displayOriginX -
          this.defaultRectangle.displayWidth +
          this.infoPlayerRectangle.displayWidth,
        this.defaultRectangle.displayOriginY -
          this.defaultRectangle.displayHeight +
          this.cardsRectangle.displayHeight +
          14,
        ImageKeyEnum.ChipsIcon
      )
      .setScale(0.14)
      .setOrigin(0);
    this.container.add(chips);
  }

  private createPlayerHand(): void {
    this.handRectangle = this.scene.add
      .rectangle(
        this.defaultRectangle.displayOriginX - this.defaultRectangle.displayWidth,
        this.defaultRectangle.displayOriginY -
          this.defaultRectangle.displayHeight +
          this.cardsRectangle.displayHeight +
          this.playerChipsRectangle.displayHeight +
          35,
        170,
        35,
        0x8c8c8c,
        1
      )
      .setStrokeStyle(2, 0x000000)
      .setOrigin(0);
    this.container.add(this.handRectangle);
    this.createHandPlayerText();
  }

  private createHandPlayerText(): void {
    this.handText = this.scene.add
      .text(
        this.handRectangle.x + this.handRectangle.width / 2,
        this.handRectangle.y + this.handRectangle.height / 2,
        'Straight Flush'.toUpperCase(),
        { fontFamily: 'ArianHeavy', fontSize: '16px', color: '#ffffff' }
      )
      .setOrigin(0.5);
    const maxTextWidth = this.handRectangle.width * 0.9;
    this.adjustFontSizeToFit(this.handText, maxTextWidth);
    this.container.add(this.handText);
  }

  private adjustFontSizeToFit(text: Phaser.GameObjects.Text, maxWidth: number) {
    const currentWidth = text.width;
    if (currentWidth > maxWidth) {
      const scaleFactor = maxWidth / currentWidth;
      const newSize = Math.floor(parseInt(text.style.fontSize.toString()) * scaleFactor);
      text.setFontSize(newSize);
    }
  }

  private flipCard(card: Phaser.GameObjects.Image): void {
    const flipDuration = 300;
    const halfFlipDuration = flipDuration / 2;
    this.scene.tweens.add({
      targets: card,
      scaleX: 0,
      duration: halfFlipDuration,
      onComplete: () => {
        if (card.texture.key === ImageKeyEnum.CardBack) {
          card.setTexture(ImageKeyEnum.Card2OfClubs);
        } else {
          card.setTexture(ImageKeyEnum.CardBack);
        }
      },
      onCompleteScope: this,
      onStart: () => {
        card.setScale(0.34);
      },
    });
    this.scene.tweens.add({
      targets: card,
      scaleX: 0.34,
      duration: halfFlipDuration,
      delay: halfFlipDuration,
    });
  }
}
