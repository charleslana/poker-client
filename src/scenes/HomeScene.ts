import * as Phaser from 'phaser';
import { ImageKeyEnum } from '../enum/ImageKeyEnum';
import { RegisterDialogComponent } from '../components/RegisterDialogComponent';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '../enum/SceneKeyEnum';

export class HomeScene extends Scene {
  constructor() {
    super(SceneKeyEnum.HomeScene);
  }

  private centerX: number;
  private centerY: number;
  private registerDialogComponent: RegisterDialogComponent;

  init(): void {
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
    this.createBg();
    this.createUI();
  }

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.HomeBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createUI(): void {
    this.createLogoText();
    const registerButton = this.createButton(this.centerX - 300, this.centerY + 100, 'Cadastrar');
    registerButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.showRegisterDialog();
    });
    const loginButton = this.createButton(this.centerX + 100, this.centerY + 100, 'Logar');
    loginButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      console.log('loginButton');
    });
    this.createFooterText();
  }

  private createLogoText(): void {
    const pokerText = this.add
      .text(this.centerX, this.centerY - 100, 'Poker', {
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

  private createButton(x: number, y: number, text: string): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const buttonText = this.createButtonText(text);
    const textWidth = buttonText.width;
    const textHeight = buttonText.height;
    let buttonWidth = textWidth + 20;
    let buttonHeight = textHeight + 20;
    buttonWidth = Math.max(buttonWidth, 200);
    buttonHeight = Math.max(buttonHeight, 50);
    const graphics = this.createBackgroundText(buttonWidth, buttonHeight);
    container.setSize(buttonWidth, buttonHeight);
    container.displayWidth = buttonWidth;
    container.displayHeight = buttonHeight;
    buttonText.setPosition(buttonWidth / 2, buttonHeight / 2);
    container.setInteractive({ cursor: 'pointer' });
    container.input!.hitArea.x += buttonWidth / 2;
    container.input!.hitArea.y += buttonHeight / 2;
    container.add([graphics, buttonText]);
    return container;
  }

  private createButtonText(text: string): Phaser.GameObjects.Text {
    return this.add
      .text(0, 0, text, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
  }

  private createBackgroundText(
    buttonWidth: number,
    buttonHeight: number
  ): Phaser.GameObjects.Graphics {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x0031ff);
    graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    graphics.lineStyle(2, 0x143787);
    graphics.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    return graphics;
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

  private restart(): void {
    console.log('enviou o emit');
    this.scene.restart();
  }
}
