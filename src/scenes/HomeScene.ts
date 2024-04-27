import * as Phaser from 'phaser';
import { ButtonComponent } from '@/components/ButtonComponent';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { LoginDialogComponent } from '@/components/LoginDialogComponent';
import { RegisterDialogComponent } from '@/components/RegisterDialogComponent';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';

export class HomeScene extends Scene {
  constructor() {
    super(SceneKeyEnum.HomeScene);
  }

  private mainCenterX: number;
  private mainCenterY: number;
  private registerDialogComponent: RegisterDialogComponent;
  private loginDialogComponent: LoginDialogComponent;
  private buttonComponent: ButtonComponent;

  init(): void {
    this.mainCenterX = this.cameras.main.width / 2;
    this.mainCenterY = this.cameras.main.height / 2;
    this.createBg();
    this.createUI();
  }

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.HomeBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createUI(): void {
    this.createLogoText();
    this.buttonComponent = new ButtonComponent(this);
    const registerButton = this.buttonComponent.createButton(
      this.mainCenterX - 300,
      this.mainCenterY + 100,
      'Cadastrar'
    );
    registerButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.showRegisterDialog();
    });
    const loginButton = this.buttonComponent.createButton(
      this.mainCenterX + 100,
      this.mainCenterY + 100,
      'Logar'
    );
    loginButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.showLoginDialog();
    });
    this.createFooterText();
  }

  private createLogoText(): void {
    const pokerText = this.add
      .text(this.mainCenterX, this.mainCenterY - 100, 'Poker', {
        fontFamily: 'Arial',
        fontSize: '72px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);
    this.add
      .text(pokerText.x + pokerText.width / 2, pokerText.y + pokerText.height / 2, 'com amigos', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0, 0.5);
  }

  private createFooterText(): void {
    this.add
      .text(10, this.cameras.main.height - 20, 'Criado por Charles Lana', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        align: 'left',
      })
      .setOrigin(0, 1);
    this.add
      .text(this.cameras.main.width - 10, this.cameras.main.height - 20, 'Versão 0.0.1', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        align: 'right',
      })
      .setOrigin(1, 1);
  }

  private showRegisterDialog(): void {
    this.registerDialogComponent = new RegisterDialogComponent(this);
    this.registerDialogComponent.on(this.registerDialogComponent.event, this.restart, this);
  }

  private showLoginDialog(): void {
    this.loginDialogComponent = new LoginDialogComponent(this);
    this.loginDialogComponent.on(this.loginDialogComponent.event, this.restart, this);
  }

  private restart(): void {
    console.log('enviou o emit');
    this.scene.restart();
  }
}
