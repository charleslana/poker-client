import * as Phaser from 'phaser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';

export class ConfirmDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createDialog();
  }

  public event = 'event';

  private blocker: Phaser.GameObjects.Rectangle;
  private overlay: Phaser.GameObjects.Rectangle;
  private modal: Phaser.GameObjects.Rectangle;
  private modalGraphics: Phaser.GameObjects.Graphics;
  private mainCenterX = this.scene.cameras.main.width / 2;
  private mainCenterY = this.scene.cameras.main.height / 2;
  private titleText: Phaser.GameObjects.Text;
  private acceptButton: Phaser.GameObjects.Image;
  private deleteButton: Phaser.GameObjects.Image;

  private createDialog(): void {
    this.createBlocker();
    this.createOverlay();
    this.createModal();
    this.createTitleText();
    this.createAcceptButton();
    this.createDeleteButton();
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
    this.modal = this.scene.add.rectangle(this.mainCenterX, this.mainCenterY + 200, 750, 250);
    this.modal.setOrigin(0.5);
    this.modal.setDepth(998);
    this.createModalGraphics();
  }

  private createModalGraphics(): void {
    this.modalGraphics = this.scene.add.graphics();
    this.modalGraphics.fillGradientStyle(0x2084fe, 0x2084fe, 0x1931a4, 0x1931a4, 1);
    this.modalGraphics.fillRect(
      this.modal.displayOriginX + 210,
      this.modal.displayOriginY + 100,
      750,
      250
    );
    this.modalGraphics.lineStyle(5, 0x49a1f1, 1);
    this.modalGraphics.strokeRoundedRect(
      this.modal.displayOriginX + 210,
      this.modal.displayOriginY + 100,
      750,
      250,
      10
    );
    this.modalGraphics.setDepth(998);
  }

  private createTitleText(): void {
    this.titleText = this.scene.add.text(
      this.mainCenterX,
      this.mainCenterY - 250,
      'Tem certeza que deseja sair?',
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

  private createAcceptButton(): void {
    this.acceptButton = this.scene.add
      .image(this.mainCenterX - 200, this.mainCenterY - 180, ImageKeyEnum.AcceptIcon)
      .setScale(0.15)
      .setOrigin(0);
    this.acceptButton.setDepth(999);
    this.acceptButton.setInteractive({ cursor: 'pointer' });
    this.acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.closeModal();
      this.emitEvent();
    });
  }

  private createDeleteButton(): void {
    this.deleteButton = this.scene.add
      .image(this.mainCenterX + 130, this.mainCenterY - 180, ImageKeyEnum.DeleteIcon)
      .setScale(0.15)
      .setOrigin(0);
    this.deleteButton.setDepth(999);
    this.deleteButton.setInteractive({ cursor: 'pointer' });
    this.deleteButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.closeModal();
    });
  }

  private closeModal(): void {
    this.blocker.destroy();
    this.overlay.destroy();
    this.modal.destroy();
    this.modalGraphics.destroy();
    this.titleText.destroy();
    this.acceptButton.destroy();
    this.deleteButton.destroy();
  }

  private emitEvent(): void {
    this.emit(this.event);
  }
}
