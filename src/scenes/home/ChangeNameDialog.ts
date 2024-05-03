import * as Phaser from 'phaser';
import UserService from '@/service/UserService';
import { ButtonComponent } from '@/components/ButtonComponent';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { InputComponent } from '@/components/InputComponent';
import { IResponse } from '@/interface/IResponse';
import { isValidName } from '@/utils/utils';
import { removeAccessToken } from '@/utils/localStorageUtils';

export class ChangeNameDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createDialog();
  }

  public event = 'event';
  public logoutEvent = 'logoutEvent';

  private blocker: Phaser.GameObjects.Rectangle;
  private overlay: Phaser.GameObjects.Rectangle;
  private modal: Phaser.GameObjects.Rectangle;
  private modalGraphics: Phaser.GameObjects.Graphics;
  private modalCloseButton: Phaser.GameObjects.Image;
  private mainCenterX = this.scene.cameras.main.width / 2;
  private mainCenterY = this.scene.cameras.main.height / 2;
  private titleText: Phaser.GameObjects.Text;
  private inputName: Phaser.GameObjects.DOMElement;
  private nameValue: string;
  private button: Phaser.GameObjects.Container;
  private inputComponent = new InputComponent(this.scene);
  private errorMessage: Phaser.GameObjects.Text;

  private createDialog(): void {
    this.createBlocker();
    this.createOverlay();
    this.createModal();
    this.createCloseButton();
    this.createTitleText();
    this.createNameInput();
    this.createButton();
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
      this.logout();
    });
  }

  private createTitleText(): void {
    this.titleText = this.scene.add.text(
      this.mainCenterX,
      this.mainCenterY - 80,
      'Qual será seu nome?',
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

  private createNameInput(): void {
    this.inputName = this.inputComponent.createInput(this.mainCenterX, this.mainCenterY - 30);
    this.inputName.on('input', (event: Event) => {
      const inputValue = (event.target as HTMLInputElement).value;
      this.nameValue = inputValue.trim();
    });
  }

  private createButton(): void {
    const button = new ButtonComponent(this.scene);
    this.button = button.createButton(this.mainCenterX - 100, this.mainCenterY + 150, 'Continuar');
    this.button.setDepth(999).on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.changeName();
    });
  }

  private createErroMessage(): void {
    this.errorMessage = this.scene.add
      .text(this.mainCenterX, this.mainCenterY + 300, '', {
        fontFamily: 'ArianHeavy',
        fontSize: '18px',
        color: '#ff0000',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(999);
  }

  private closeModal(): void {
    this.blocker.destroy();
    this.overlay.destroy();
    this.modal.destroy();
    this.modalGraphics.destroy();
    this.modalCloseButton.destroy();
    this.titleText.destroy();
    this.inputName.destroy();
    this.nameValue = '';
    this.button.destroy();
    this.errorMessage.destroy();
  }

  private emitEvent(): void {
    this.emit(this.event);
  }

  private async changeName(): Promise<void> {
    this.errorMessage.setText('');
    if (!this.nameValue || !isValidName(this.nameValue)) {
      this.errorMessage.setText(
        'Nome inválido, ele deve conter apenas letras sem acentos e números'
      );
      return;
    }
    if (this.nameValue.length < 3 || this.nameValue.length > 15) {
      this.errorMessage.setText('O nome deve conter entre 3 a 15 caracteres');
      return;
    }
    this.disableButton();
    try {
      await UserService.updateName(this.nameValue);
      this.emitEvent();
    } catch (error) {
      const err = error as IResponse;
      this.errorMessage.setText(err.response?.data.message ?? 'Error network');
    } finally {
      this.enableButton();
    }
  }

  private disableButton(): void {
    this.button.disableInteractive();
  }

  private enableButton(): void {
    this.button.setInteractive();
  }

  private logout(): void {
    this.emit(this.logoutEvent);
    this.closeModal();
    removeAccessToken();
  }
}
