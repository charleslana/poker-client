import * as Phaser from 'phaser';
import UserService from '@/service/UserService';
import { ButtonComponent } from './ButtonComponent';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { InputComponent } from './InputComponent';
import { IResponse } from '@/interface/IResponse';
import { isValidEmail } from '@/utils/utils';

export class RegisterDialogComponent extends Phaser.GameObjects.Container {
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
  private emailText: Phaser.GameObjects.Text;
  private inputEmail: Phaser.GameObjects.DOMElement;
  private emailValue: string;
  private passwordText: Phaser.GameObjects.Text;
  private inputPassword: Phaser.GameObjects.DOMElement;
  private passwordValue: string;
  private button: Phaser.GameObjects.Container;
  private inputComponent = new InputComponent(this.scene);
  private errorMessage: Phaser.GameObjects.Text;

  private createDialog(): void {
    this.createBlocker();
    this.createOverlay();
    this.createModal();
    this.createCloseButton();
    this.createTitleText();
    this.createEmailText();
    this.createEmailInput();
    this.createPasswordText();
    this.createPasswordInput();
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
      this.closeModal();
    });
  }

  private createTitleText(): void {
    this.titleText = this.scene.add.text(this.mainCenterX, this.mainCenterY - 135, 'Cadastro', {
      fontFamily: 'ArianHeavy',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: {
        width: 480,
        useAdvancedWrap: true,
      },
    });
    this.titleText.setOrigin(0.5);
    this.titleText.setDepth(999);
  }

  private createEmailText(): void {
    this.emailText = this.scene.add
      .text(this.mainCenterX, this.mainCenterY - 80, 'Digite seu e-mail abaixo', {
        fontFamily: 'ArianHeavy',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(999);
  }

  private createEmailInput(): void {
    this.inputEmail = this.inputComponent.createInput(this.mainCenterX, this.mainCenterY - 30);
    this.inputEmail.on('input', (event: Event) => {
      const inputValue = (event.target as HTMLInputElement).value;
      this.emailValue = inputValue;
    });
  }

  private createPasswordText(): void {
    this.passwordText = this.scene.add
      .text(this.mainCenterX, this.mainCenterY + 30, 'Digite sua senha', {
        fontFamily: 'ArianHeavy',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(999);
  }

  private createPasswordInput(): void {
    this.inputPassword = this.inputComponent.createInput(
      this.mainCenterX,
      this.mainCenterY + 70,
      true
    );
    this.inputPassword.on('input', (event: Event) => {
      const inputValue = (event.target as HTMLInputElement).value;
      this.passwordValue = inputValue;
    });
  }

  private createButton(): void {
    const button = new ButtonComponent(this.scene);
    this.button = button.createButton(this.mainCenterX - 100, this.mainCenterY + 150, 'Cadastrar');
    this.button.setDepth(999).on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.register();
    });
  }

  private createErroMessage(): void {
    this.errorMessage = this.scene.add
      .text(this.mainCenterX, this.mainCenterY + 300, '', {
        fontFamily: 'ArianHeavy',
        fontSize: '18px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 2,
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
    this.emailText.destroy();
    this.inputEmail.destroy();
    this.emailValue = '';
    this.passwordText.destroy();
    this.inputPassword.destroy();
    this.passwordValue = '';
    this.button.destroy();
    this.errorMessage.destroy();
  }

  private emitEvent(): void {
    this.emit(this.event, this.emailValue, this.passwordValue);
    this.closeModal();
  }

  private async register(): Promise<void> {
    this.errorMessage.setText('');
    if (!isValidEmail(this.emailValue)) {
      this.errorMessage.setText('E-mail inválido, ele deve ser válido e minúsculo');
      return;
    }
    if (!this.passwordValue || this.passwordValue.length < 6) {
      this.errorMessage.setText('A senha deve conter no mínimo 6 caracteres');
      return;
    }
    this.disableButton();
    try {
      await UserService.register(this.emailValue, this.passwordValue);
      this.emitEvent();
    } catch (error) {
      const err = error as IResponse;
      this.errorMessage.setText(err.response?.data.message ?? 'Error network');
      this.enableButton();
    }
  }

  private disableButton(): void {
    this.button.disableInteractive();
  }

  private enableButton(): void {
    this.button.setInteractive();
  }
}
