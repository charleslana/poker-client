import * as Phaser from 'phaser';
import { ButtonComponent } from '@/components/ButtonComponent';
import { HostDialog } from './HostDialog';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { MessageListContainer } from './MessageListContainer';
import { removeAccessToken } from '@/utils/localStorageUtils';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';
import { UserListContainer } from './UserListContainer';
import { JoinDialog } from './JoinDialog';

export class LobbyScene extends Scene {
  constructor() {
    super(SceneKeyEnum.LobbyScene);
  }

  private messageListContainer: MessageListContainer;
  private userListContainer: UserListContainer;

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
    const bootBg = this.add.image(0, 0, ImageKeyEnum.LobbyBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createNameText(): void {
    const textX = 10;
    const textY = 30;
    const text = this.add
      .text(textX, textY, 'User1', {
        fontFamily: 'ArianHeavy',
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
    this.userListContainer = new UserListContainer(this);
    this.messageListContainer = new MessageListContainer(this);
    this.createHostButton(containerHeight);
    this.createJoinButton(containerHeight);
    container.add([
      boxGraphics,
      headerGraphics,
      this.userListContainer.createUserListGraphics(),
      this.userListContainer.userListDiv,
      this.messageListContainer.createMessageGraphics(),
      this.messageListContainer.messageListDiv,
      this.messageListContainer.createMessageInputGraphics(),
    ]);
  }

  private createBoxGraphics(containerWidth: number, containerHeight: number) {
    const positionX = 0;
    const positionY = 0;
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 0);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xe5d16a, 1);
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
    graphics.lineStyle(3, 0xe5d16a, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }

  private createHostButton(containerHeight: number): void {
    const buttonComponent = new ButtonComponent(this);
    const button = buttonComponent.createButton(42, containerHeight + 200, 'Host');
    button.on(Phaser.Input.Events.POINTER_DOWN, () => {
      const hostDialog = new HostDialog(this);
      hostDialog.on(hostDialog.event, this.showLobby, this);
      this.messageListContainer.hideMessage();
      this.userListContainer.hideUser();
    });
  }

  private showLobby(): void {
    this.messageListContainer.showMessage();
    this.userListContainer.showUser();
  }

  private createJoinButton(containerHeight: number): void {
    const buttonComponent = new ButtonComponent(this);
    const button = buttonComponent.createButton(300, containerHeight + 200, 'Join');
    button.on(Phaser.Input.Events.POINTER_DOWN, () => {
      const joinDialog = new JoinDialog(this);
      joinDialog.on(joinDialog.event, this.showLobby, this);
      this.messageListContainer.hideMessage();
      this.userListContainer.hideUser();
    });
  }
}
