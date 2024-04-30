import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { removeAccessToken } from '@/utils/localStorageUtils';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';

export class LobbyScene extends Scene {
  constructor() {
    super(SceneKeyEnum.LobbyScene);
  }

  create(): void {
    this.createBg();
    this.createHeader();
    this.createMainSection();
  }

  private createHeader(): void {
    this.createNameText();
    this.createLobbyText();
    this.createCloseButton();
  }

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.HomeBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createNameText(): void {
    const textX = 10;
    const textY = 30;
    const text = this.add
      .text(textX, textY, 'Name Nv. 1', {
        fontFamily: 'Roboto',
        fontSize: '30px',
        color: '#ffffff',
      })
      .setOrigin(0, 0.5);
    text.setX(textX);
  }

  private createLobbyText(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = 30;
    const text = this.add
      .text(centerX, centerY, 'LOBBY', {
        fontFamily: 'Bebas',
        fontSize: '42px',
        color: '#ffffff',
      })
      .setOrigin(0.5, 0);
    text.setX(centerX - text.width / 2);
  }

  private createCloseButton(): void {
    const closeButton = this.add
      .image(this.cameras.main.width - 10, 10, ImageKeyEnum.CloseIcon)
      .setOrigin(1, 0);
    closeButton.setInteractive({ cursor: 'pointer' });
    closeButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.logout();
    });
  }

  private logout(): void {
    removeAccessToken();
    this.scene.start(SceneKeyEnum.HomeScene);
  }

  private createMainSection(): void {
    const containerWidth = this.cameras.main.width * 0.95;
    const containerHeight = this.cameras.main.height * 0.7;
    const container = this.add.container(0, 0);
    container.setSize(containerWidth, containerHeight);
    container.setPosition(45, 100);
    const boxGraphics = this.createBoxGraphics(containerWidth, containerHeight);
    const headerGraphics = this.createHeaderGraphics(containerWidth);
    const messageGraphics = this.createMessageGraphics();
    const userListGraphics = this.createUserListGraphics();
    container.add([boxGraphics, headerGraphics, messageGraphics, userListGraphics]);
  }

  private createBoxGraphics(containerWidth: number, containerHeight: number) {
    const positionX = 0;
    const positionY = 0;
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 0);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xffff00, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }

  private createHeaderGraphics(containerWidth: number): Phaser.GameObjects.Graphics {
    const positionX = 0;
    const positionY = 0;
    const containerHeight = this.cameras.main.height * 0.179;
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x333333, 0x333333, 0x888888, 0x888888, 1);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xffff00, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }

  private createMessageGraphics(): Phaser.GameObjects.Graphics {
    const containerWidth = this.cameras.main.width * 0.7;
    const containerHeight = this.cameras.main.height * 0.519;
    const positionX = 0;
    const positionY = this.cameras.main.height - this.cameras.main.height * 0.82;
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x373a97, 0x373a97, 0x535fb5, 0x535fb5, 1);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xffff00, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }

  private createUserListGraphics(): Phaser.GameObjects.Graphics {
    const containerWidth = this.cameras.main.width * 0.25;
    const containerHeight = this.cameras.main.height * 0.519;
    const positionX = this.cameras.main.width - containerWidth - 96;
    const positionY = this.cameras.main.height - this.cameras.main.height * 0.82;
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x373a97, 0x373a97, 0x535fb5, 0x535fb5, 1);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xffff00, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }
}
