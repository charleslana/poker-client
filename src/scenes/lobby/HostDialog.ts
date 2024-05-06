import * as Phaser from 'phaser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { IRoom } from '@/interface/IRoom';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';
import { Socket } from 'socket.io-client';
import { SocketSingleton } from '@/config/SocketSingleton';

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
  private mainCenterX = this.scene.cameras.main.width / 2;
  private mainCenterY = this.scene.cameras.main.height / 2;
  private titleText: Phaser.GameObjects.Text;
  private inputName: Phaser.GameObjects.DOMElement;
  private acceptButton: Phaser.GameObjects.Image;
  private deleteButton: Phaser.GameObjects.Image;
  private inputValue: string | undefined;
  private socket: Socket;
  private errorMessage: Phaser.GameObjects.Text;

  private createDialog(): void {
    this.createBlocker();
    this.createOverlay();
    this.createModal();
    this.createTitleText();
    this.createInput();
    this.createAcceptButton();
    this.createDeleteButton();
    this.createErroMessage();
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
    this.modal = this.scene.add.rectangle(this.mainCenterX, this.mainCenterY + 200, 750, 300);
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
      300
    );
    this.modalGraphics.lineStyle(5, 0x49a1f1, 1);
    this.modalGraphics.strokeRoundedRect(
      this.modal.displayOriginX + 210,
      this.modal.displayOriginY + 100,
      750,
      300,
      10
    );
    this.modalGraphics.setDepth(998);
  }

  private createTitleText(): void {
    this.titleText = this.scene.add.text(
      this.mainCenterX,
      this.mainCenterY - 250,
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

  private createInput(): void {
    const positionX = this.scene.cameras.main.width / 2;
    const positionY = this.scene.cameras.main.height / 2 - 150;
    this.inputName = this.scene.add.dom(
      positionX,
      positionY,
      'input',
      `
        width: 450px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border: 3px solid black;
        background-color: rgba(255, 255, 255, 1);
        outline: none;
        color: black;
        font-family: 'ArianHeavy';
      `
    );
    this.inputName.node.setAttribute('type', 'text');
    this.inputName.node.setAttribute('placeholder', '');
    this.inputName.addListener('input');
    this.inputName.on('input', (event: Event) => {
      const inputValue = (event.target as HTMLInputElement).value;
      this.inputValue = inputValue.trim();
    });
  }

  private createAcceptButton(): void {
    this.acceptButton = this.scene.add
      .image(this.mainCenterX - 200, this.mainCenterY - 100, ImageKeyEnum.AcceptIcon)
      .setScale(0.15)
      .setOrigin(0);
    this.acceptButton.setDepth(999);
    this.acceptButton.setInteractive({ cursor: 'pointer' });
    this.acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.handleCreateRoom();
    });
  }

  private handleCreateRoom(): void {
    this.errorMessage.setText('');
    if (!this.validateName()) {
      this.errorMessage.setText(
        'O nome da sala deve estar entre 1 a 15 caracteres, o nome deve conter apenas letras, números e espaço'
      );
      return;
    }
    this.socket = SocketSingleton.getInstance();
    this.socket.emit('createRoom', this.inputValue);
    this.socket.on('createRoomSuccess', (room: IRoom) => {
      this.socket.off('allUsers');
      this.socket.off('lastMessage');
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.scene.scene.start(SceneKeyEnum.GameScene, room);
    });
  }

  private validateName(): boolean {
    const name = this.inputValue;
    if (!name) {
      return false;
    }
    if (name.length < 1 || name.length > 15) {
      return false;
    }
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(name)) {
      return false;
    }
    return true;
  }

  private createDeleteButton(): void {
    this.deleteButton = this.scene.add
      .image(this.mainCenterX + 130, this.mainCenterY - 100, ImageKeyEnum.DeleteIcon)
      .setScale(0.15)
      .setOrigin(0);
    this.deleteButton.setDepth(999);
    this.deleteButton.setInteractive({ cursor: 'pointer' });
    this.deleteButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.closeModal();
    });
  }

  private createErroMessage(): void {
    this.errorMessage = this.scene.add
      .text(this.mainCenterX, this.mainCenterY + 100, '', {
        fontFamily: 'ArianHeavy',
        fontSize: '18px',
        color: '#ff0000',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(999);
  }

  private closeModal(): void {
    this.emitEvent();
    this.blocker.destroy();
    this.overlay.destroy();
    this.modal.destroy();
    this.modalGraphics.destroy();
    this.titleText.destroy();
    this.inputName.destroy();
    this.acceptButton.destroy();
    this.deleteButton.destroy();
    this.errorMessage.destroy();
  }

  private emitEvent(): void {
    this.emit(this.event);
  }
}
