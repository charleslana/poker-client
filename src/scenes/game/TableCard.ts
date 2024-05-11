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

  private create(): void {
    this.mainCenterX = this.scene.cameras.main.width / 2;
    this.mainCenterY = this.scene.cameras.main.height / 2;
    this.image = this.scene.add.image(0, 0, ImageKeyEnum.CardBack1).setScale(0.5).setOrigin(0);
  }

  private flip(): void {
    const timeline = this.scene.add.timeline([
      {
        at: 0,
        tween: {
          targets: this.image,
          scaleX: 0,
          duration: 300,
          delay: 200,
          onComplete: () => {
            this.image.setTexture(ImageKeyEnum.Card2OfClubs);
          },
        },
      },
      {
        at: 500,
        tween: {
          targets: this.image,
          scale: 0.5,
          duration: 300,
        },
      },
    ]);
    timeline.play();
  }
}
