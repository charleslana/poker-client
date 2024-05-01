import * as Phaser from 'phaser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { removeAccessToken } from '@/utils/localStorageUtils';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';

export class LobbyScene extends Scene {
  constructor() {
    super(SceneKeyEnum.LobbyScene);
  }

  private userList: string[] = [];
  private userListDiv: Phaser.GameObjects.DOMElement;
  private messageListDiv: Phaser.GameObjects.DOMElement;

  init(): void {
    this.createUserList();
  }

  create(): void {
    this.createBg();
    this.createHeader();
    this.createMainSection();
  }

  private createUserList(): void {
    this.generateUserList(100);
    this.input.keyboard!.on('keydown-ONE', () => {
      this.addMoreUsers();
    });
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
    this.createUserListDiv();
    this.createMessageListDiv();
    container.add([
      boxGraphics,
      headerGraphics,
      messageGraphics,
      userListGraphics,
      this.userListDiv,
      this.messageListDiv,
    ]);
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

  private createUserListDiv(): void {
    const positionX = this.cameras.main.width - 345;
    const positionY = this.cameras.main.height - this.cameras.main.height * 0.56;
    this.userListDiv = this.add.dom(
      positionX,
      positionY,
      'div',
      `
        width: 455px;
        height: 535px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border: 0px solid red;
        background-color: rgba(255, 255, 255, 0);
        color: black;
        font-family: 'Roboto';
        overflow-y: scroll;
     `
    );
    this.updateUserListDisplay();
  }

  private updateUserListDisplay(): void {
    this.clearUserList();
    this.userList.forEach((user) => {
      const userContainer = this.createUserContainer(user);
      this.userListDiv.node.appendChild(userContainer);
    });
  }

  private clearUserList(): void {
    this.userListDiv.node.innerHTML = '';
  }

  private createUserContainer(user: string): HTMLDivElement {
    const userContainer = document.createElement('div');
    userContainer.style.display = 'flex';
    userContainer.style.flexDirection = 'row';
    userContainer.style.alignItems = 'center';
    userContainer.style.width = '100%';
    userContainer.style.marginBottom = '5px';
    userContainer.style.backgroundColor = '#70706e';
    userContainer.style.borderRadius = '5px';
    const jElement = this.createJElement();
    const nameElement = this.createNameElement(user);
    userContainer.appendChild(jElement);
    userContainer.appendChild(nameElement);
    return userContainer;
  }

  private createJElement(): HTMLDivElement {
    const jElement = document.createElement('div');
    jElement.textContent = 'J';
    jElement.style.padding = '5px';
    jElement.style.backgroundColor = '#b23a1f';
    jElement.style.color = 'black';
    jElement.style.fontFamily = 'Bebas';
    jElement.style.borderRadius = '5px';
    jElement.style.fontSize = '20px';
    return jElement;
  }

  private createNameElement(userName: string): HTMLDivElement {
    const nameElement = document.createElement('div');
    nameElement.textContent = userName;
    nameElement.style.padding = '5px';
    nameElement.style.color = 'white';
    return nameElement;
  }

  private generateUserList(count: number): void {
    this.userList = Array.from({ length: count }, (_, index) => `User${index + 1}`);
  }

  private addMoreUsers(): void {
    const additionalUsersCount = 50;
    const newUserCount = this.userList.length + additionalUsersCount;
    this.generateUserList(newUserCount);
    this.updateUserListDisplay();
  }

  private createMessageListDiv(): void {
    const positionX = this.cameras.main.width - 1257;
    const positionY = this.cameras.main.height - this.cameras.main.height * 0.56;
    this.messageListDiv = this.add.dom(
      positionX,
      positionY,
      'div',
      `
        width: 1318px;
        height: 535px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border: 1px solid red;
        background-color: rgba(255, 255, 255, 1);
        color: black;
        font-family: 'Roboto';
        overflow-y: scroll;
     `
    );
  }
}
