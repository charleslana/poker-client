import * as Phaser from 'phaser';
import { IPlayer } from '@/interface/IPlayer';
import { Socket } from 'socket.io-client';
import { SocketSingleton } from '@/config/SocketSingleton';

export class UserListContainer extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createUserListDiv();
    this.handleUsersConnected();
  }

  public userListDiv: Phaser.GameObjects.DOMElement;

  private userList: IPlayer[] = [];
  private socket: Socket;

  public createUserListGraphics(): Phaser.GameObjects.Graphics {
    const containerWidth = this.scene.cameras.main.width * 0.25;
    const containerHeight = this.scene.cameras.main.height * 0.519;
    const positionX = this.scene.cameras.main.width - containerWidth - 96;
    const positionY = this.scene.cameras.main.height - this.scene.cameras.main.height * 0.82;
    const graphics = this.scene.add.graphics();
    graphics.fillGradientStyle(0x373a97, 0x373a97, 0x535fb5, 0x535fb5, 1);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xe5d16a, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }

  public hideUser(): void {
    this.userListDiv.setVisible(false);
  }

  public showUser(): void {
    this.userListDiv.setVisible(true);
  }

  private handleUsersConnected(): void {
    this.socket = SocketSingleton.getInstance();
    this.socket.on('allUsers', (users: IPlayer[]) => {
      console.log('Lista de todos os usuários conectados:', users);
      this.changeUserList(users);
    });
  }

  private changeUserList(users: IPlayer[]): void {
    this.userList = users;
    this.updateUserListDisplay();
  }

  private createUserListDiv(): void {
    const positionX = this.scene.cameras.main.width - 345;
    const positionY = this.scene.cameras.main.height - this.scene.cameras.main.height * 0.56;
    this.userListDiv = this.scene.add.dom(
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
        font-family: 'ArianHeavy';
        overflow-y: scroll;
     `
    );
    this.updateUserListDisplay();
  }

  private updateUserListDisplay(): void {
    this.clearUserList();
    this.userList.forEach((user) => {
      const userContainer = this.createUserContainer(user.name);
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
    const pElement = this.createPElement();
    const nameElement = this.createNameElement(user);
    userContainer.appendChild(pElement);
    userContainer.appendChild(nameElement);
    return userContainer;
  }

  private createPElement(): HTMLDivElement {
    const pElement = document.createElement('div');
    pElement.textContent = 'J';
    pElement.style.padding = '10px';
    pElement.style.backgroundColor = '#b23a1f';
    pElement.style.color = 'black';
    pElement.style.fontFamily = 'Bebas';
    pElement.style.borderRadius = '5px';
    pElement.style.fontSize = '20px';
    return pElement;
  }

  private createNameElement(userName: string): HTMLDivElement {
    const nameElement = document.createElement('div');
    nameElement.textContent = userName;
    nameElement.style.padding = '5px';
    nameElement.style.color = 'white';
    return nameElement;
  }
}
