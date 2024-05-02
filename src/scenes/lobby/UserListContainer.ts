import * as Phaser from 'phaser';

export class UserListContainer extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.create();
  }

  public userList: string[] = [];
  public userListDiv: Phaser.GameObjects.DOMElement;

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

  private create(): void {
    this.createUserList();
    this.createUserListDiv();
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

  private createUserList(): void {
    this.generateUserList(50);
    this.scene.input.keyboard!.on('keydown-ONE', () => {
      this.addMoreUsers();
    });
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
    jElement.style.padding = '10px';
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
}
