import * as Phaser from 'phaser';
import { ButtonComponent } from './ButtonComponent';
import { ImageKeyEnum } from '@enum/ImageKeyEnum';
import { InputComponent } from './InputComponent';

export class RegisterDialogComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createDialog();
  }

  public event = 'event';

  private blocker: Phaser.GameObjects.Rectangle;
  private overlay: Phaser.GameObjects.Rectangle;
  private modal: Phaser.GameObjects.Rectangle;
  private modalBackground: Phaser.GameObjects.Image;
  private modalCloseButton: Phaser.GameObjects.Image;
  private mainCenterX = this.scene.cameras.main.width / 2;
  private mainCenterY = this.scene.cameras.main.height / 2;
  private registerText: Phaser.GameObjects.Text;
  private emailText: Phaser.GameObjects.Text;
  private inputEmail: Phaser.GameObjects.Text;
  private emailValue: string;
  private passwordText: Phaser.GameObjects.Text;
  private inputPassword: Phaser.GameObjects.Text;
  private passwordValue: string;
  private registerButton: Phaser.GameObjects.Container;
  private inputComponent = new InputComponent(this.scene);

  private createDialog(): void {
    this.createBlocker();
    this.createOverlay();
    this.createModalBackground();
    this.createCloseButton();
    this.createRegisterText();
    this.createEmailText();
    this.createEmailInput();
    this.createPasswordText();
    this.createPasswordInput();
    this.createRegisterButton();
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

  private createModalBackground(): void {
    this.modal = this.scene.add.rectangle(this.mainCenterX, this.mainCenterY, 750, 500);
    this.modal.setOrigin(0.5);
    this.modal.setDepth(998);
    this.modalBackground = this.scene.add.image(
      this.mainCenterX,
      this.mainCenterY,
      ImageKeyEnum.DialogBg
    );
    this.modalBackground.setOrigin(0.5);
    this.modalBackground.setDepth(998);
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
      this.emitButton();
    });
  }

  private createRegisterText(): void {
    this.registerText = this.scene.add.text(this.mainCenterX, this.mainCenterY - 135, 'Cadastro', {
      fontFamily: 'Arial',
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
    this.registerText.setOrigin(0.5);
    this.registerText.setDepth(999);
  }

  private createEmailText(): void {
    this.emailText = this.scene.add
      .text(this.mainCenterX, this.mainCenterY - 60, 'Digite seu e-mail abaixo', {
        fontFamily: 'Arial',
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
    this.inputEmail = this.inputComponent.createInput({
      positionX: this.mainCenterX,
      positionY: this.mainCenterY - 10,
      type: 'text',
      placeholder: 'example@example.com',
    });
    this.inputEmail.on('textchange', (inputText: any) => {
      this.emailValue = inputText.text;
      console.log(this.emailValue);
    });
  }

  private createPasswordText(): void {
    this.passwordText = this.scene.add
      .text(this.mainCenterX, this.mainCenterY + 50, 'Digite sua senha', {
        fontFamily: 'Arial',
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
    this.inputPassword = this.inputComponent.createInput({
      positionX: this.mainCenterX,
      positionY: this.mainCenterY + 90,
      type: 'password',
      placeholder: '*********',
    });
    this.inputPassword.on('textchange', (inputText: any) => {
      this.passwordValue = inputText.text;
      console.log(this.passwordValue);
    });
  }

  private createRegisterButton(): void {
    const registerButton = new ButtonComponent(this.scene);
    this.registerButton = registerButton.createButton(
      this.mainCenterX - 100,
      this.mainCenterY + 150,
      'Cadastrar'
    );
    this.registerButton.setDepth(999).on(Phaser.Input.Events.POINTER_DOWN, () => {
      console.log('register');
    });
  }

  private emitButton(): void {
    // this.emit(this.event);
    this.blocker.destroy();
    this.overlay.destroy();
    this.modal.destroy();
    this.modalBackground.destroy();
    this.modalCloseButton.destroy();
    this.registerText.destroy();
    this.emailText.destroy();
    this.inputEmail.destroy();
    this.emailValue = '';
    this.passwordText.destroy();
    this.inputPassword.destroy();
    this.passwordValue = '';
    this.registerButton.destroy();
  }
}
