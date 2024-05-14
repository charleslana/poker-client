import { ImageKeyEnum } from '@/enum/ImageKeyEnum';

export class TableCard extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.create();
  }

  private mainCenterX: number;
  private mainCenterY: number;
  private image: Phaser.GameObjects.Image;

  public setTableCard(index: number): void {
    switch (index + 1) {
      case 1:
        this.image.setPosition(this.mainCenterX - 200, this.mainCenterY - 55);
        break;
      case 2:
        this.image.setPosition(this.mainCenterX - 120, this.mainCenterY - 55);
        break;
      case 3:
        this.image.setPosition(this.mainCenterX - 40, this.mainCenterY - 55);
        break;
      case 4:
        this.image.setPosition(this.mainCenterX + 40, this.mainCenterY - 55);
        break;
      case 5:
        this.image.setPosition(this.mainCenterX + 120, this.mainCenterY - 55);
        break;
      default:
        this.image.setPosition(0, 0);
    }
  }

  public createFlipEvent(): void {
    this.image.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.flip();
    });
  }

  public moveCardToCenter(x: number, y: number): void {
    const card = this.scene.add.image(x, y, ImageKeyEnum.CardBack).setScale(0.34).setOrigin(0);
    card.setPosition(x, y);
    const moveDuration = 500;
    const tableCenterX = this.mainCenterX;
    const tableCenterY = this.mainCenterY - 50;
    this.scene.tweens.add({
      targets: card,
      x: tableCenterX,
      y: tableCenterY,
      duration: moveDuration,
      onComplete: () => {
        this.fadeOutCard(card);
      },
    });
  }

  private fadeOutCard(card: Phaser.GameObjects.Image): void {
    const fadeDuration = 300;
    this.scene.tweens.add({
      targets: card,
      alpha: 0,
      duration: fadeDuration,
      onComplete: () => {
        // this.fadeInCard(card);
      },
    });
  }

  // private fadeInCard(card: Phaser.GameObjects.Image): void {
  //   const fadeInDuration = 300;
  //   const tableCenterX = this.mainCenterX;
  //   const tableCenterY = this.mainCenterY - 50;
  //   card.setPosition(tableCenterX, tableCenterY);
  //   card.setAlpha(0);
  //   this.scene.tweens.add({
  //     targets: card,
  //     alpha: 1,
  //     duration: fadeInDuration,
  //   });
  // }

  private create(): void {
    this.mainCenterX = this.scene.cameras.main.width / 2;
    this.mainCenterY = this.scene.cameras.main.height / 2;
    this.image = this.scene.add.image(0, 0, ImageKeyEnum.CardBack).setScale(0.34).setOrigin(0);
  }

  private flip(): void {
    const flipDuration = 300;
    const halfFlipDuration = flipDuration / 2;
    this.scene.tweens.add({
      targets: this.image,
      scaleX: 0,
      duration: halfFlipDuration,
      onComplete: () => {
        if (this.image.texture.key === ImageKeyEnum.CardBack) {
          this.image.setTexture(ImageKeyEnum.Card3OfDiamonds);
        } else {
          this.image.setTexture(ImageKeyEnum.CardBack);
        }
      },
      onCompleteScope: this,
      onStart: () => {
        this.image.setScale(0.34);
      },
    });
    this.scene.tweens.add({
      targets: this.image,
      scaleX: 0.34,
      duration: halfFlipDuration,
      delay: halfFlipDuration,
    });
  }
}
