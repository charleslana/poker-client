import * as Phaser from 'phaser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';

export class HostDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createDialog();
  }

  public event = 'event';

  private blocker: Phaser.GameObjects.Rectangle;
  private overlay: Phaser.GameObjects.Rectangle;
  private modal: Phaser.GameObjects.Rectangle;
  private modalGraphics: Phaser.GameObjects.Graphics;
  private modalCloseButton: Phaser.GameObjects.Image;
  private mainCenterX = this.scene.cameras.main.width / 2;
  private mainCenterY = this.scene.cameras.main.height / 2;
  private titleText: Phaser.GameObjects.Text;

  private createDialog(): void {
    this.createBlocker();
    this.createOverlay();
    this.createModal();
    this.createCloseButton();
    this.createTitleText();
  }

  private createBlocker(): void {
    this.blocker = this.scene.add.rectangle(
      0,
      0,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      0x000000,
      0
    );
    this.blocker.setOrigin(0, 0);
    this.blocker.setInteractive();
    this.blocker.setDepth(996);
    this.blocker.on(Phaser.Input.Events.POINTER_DOWN, () => {});
  }

  private createOverlay(): void {
    this.overlay = this.scene.add.rectangle(
      0,
      0,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      0x000000,
      0.5
    );
    this.overlay.setOrigin(0, 0);
    this.overlay.setDepth(997);
  }

  private createModal(): void {
    this.modal = this.scene.add.rectangle(this.mainCenterX, this.mainCenterY, 750, 500);
    this.modal.setOrigin(0.5);
    this.modal.setDepth(998);
    this.createModalGraphics();
  }

  private createModalGraphics(): void {
    this.modalGraphics = this.scene.add.graphics();
    this.modalGraphics.fillGradientStyle(0x2084fe, 0x2084fe, 0x1931a4, 0x1931a4, 1);
    this.modalGraphics.fillRect(
      this.modal.displayOriginX + 210,
      this.modal.displayOriginY + 40,
      750,
      500
    );
    this.modalGraphics.lineStyle(5, 0x49a1f1, 1);
    this.modalGraphics.strokeRoundedRect(
      this.modal.displayOriginX + 210,
      this.modal.displayOriginY + 40,
      750,
      500,
      10
    );
    this.modalGraphics.setDepth(998);
  }

  private createCloseButton(): void {
    this.modalCloseButton = this.scene.add
      .image(
        this.mainCenterX + this.modal.width / 2 - 30,
        this.mainCenterY - this.modal.height / 2 - 20,
        ImageKeyEnum.CloseIcon
      )
      .setOrigin(0);
    this.modalCloseButton.setDepth(999);
    this.modalCloseButton.setInteractive({ cursor: 'pointer' });
    this.modalCloseButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.closeModal();
    });
  }

  private createTitleText(): void {
    this.titleText = this.scene.add.text(
      this.mainCenterX,
      this.mainCenterY - 200,
      'Create Your Game Room',
      {
        fontFamily: 'ArianHeavy',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        wordWrap: {
          width: 480,
          useAdvancedWrap: true,
        },
      }
    );
    this.titleText.setOrigin(0.5);
    this.titleText.setDepth(999);
  }

  private closeModal(): void {
    this.blocker.destroy();
    this.overlay.destroy();
    this.modal.destroy();
    this.modalGraphics.destroy();
    this.modalCloseButton.destroy();
    this.titleText.destroy();
  }

  // private emitEvent(): void {
  //   this.emit(this.event);
  //   this.closeModal();
  // }
}
