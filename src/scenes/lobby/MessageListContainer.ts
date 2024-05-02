import * as Phaser from 'phaser';
import { formatDate } from '@/utils/utils';
import { IChat } from '@/interface/IChat';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';

export class MessageListContainer extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.create();
  }

  public messageList: IChat[] = [];
  public messageListDiv: Phaser.GameObjects.DOMElement;

  private messageInput: Phaser.GameObjects.DOMElement;

  public createMessageGraphics(): Phaser.GameObjects.Graphics {
    const containerWidth = this.scene.cameras.main.width * 0.7;
    const containerHeight = this.scene.cameras.main.height * 0.519;
    const positionX = 0;
    const positionY = this.scene.cameras.main.height - this.scene.cameras.main.height * 0.82;
    const graphics = this.scene.add.graphics();
    graphics.fillGradientStyle(0x373a97, 0x373a97, 0x535fb5, 0x535fb5, 1);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xe5d16a, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }

  public createMessageInputGraphics(): Phaser.GameObjects.Graphics {
    const containerWidth = this.scene.cameras.main.width * 0.92;
    const containerHeight = this.scene.cameras.main.height * 0.05;
    const positionX = 0;
    const positionY = this.scene.cameras.main.height - this.scene.cameras.main.height * 0.298;
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(positionX, positionY, containerWidth, containerHeight);
    graphics.lineStyle(3, 0xe5d16a, 1);
    graphics.strokeRect(positionX, positionY, containerWidth, containerHeight);
    return graphics;
  }

  private create(): void {
    this.createMessageList();
    this.createMessageListDiv();
    this.createMessageInput();
    this.createEnterButton();
  }

  private createMessageListDiv(): void {
    const positionX = this.scene.cameras.main.width - 1257;
    const positionY = this.scene.cameras.main.height - this.scene.cameras.main.height * 0.56;
    this.messageListDiv = this.scene.add.dom(
      positionX,
      positionY,
      'div',
      `
        width: 1318px;
        height: 535px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border: 0px solid red;
        background-color: rgba(255, 255, 255, 0);
        color: black;
        font-family: 'ArianHeavy';
        overflow-y: scroll;
        word-break: break-word;
     `
    );
    this.updateMessageListDisplay();
  }

  private createMessageList(): void {
    this.addMessageFromServer();
    this.scene.input.keyboard!.on('keydown-ENTER', () => {
      this.handleAddMessage();
    });
  }

  private addMessageFromServer(): void {
    this.messageList.push({
      userName: '[Server]',
      date: new Date(),
      message:
        'Bem vindo, - User1! Se já existir um jogo em aberto você pode entrar e ver a partida, caso contrário você pode criar sua sala para que outros jogadores possam entrar.',
    });
  }

  private handleAddMessage(): void {
    const input = this.messageInput.node as HTMLInputElement;
    if (input.value.trim() !== '') {
      this.addMessage('User1', input.value.trim());
      input.value = '';
      this.messageListDiv.node.scrollTop = this.messageListDiv.node.scrollHeight;
    }
  }

  private addMessage(userName: string, message: string): void {
    this.generateMessageList(userName, message);
    this.updateMessageListDisplay();
  }

  private generateMessageList(userName: string, message: string): void {
    this.messageList.push({
      userName,
      date: new Date(),
      message,
    });
  }

  private updateMessageListDisplay(): void {
    this.clearMessageList();
    this.messageList.forEach((chat) => {
      const messageContainer = this.createMessageContainer(chat);
      this.messageListDiv.node.appendChild(messageContainer);
    });
  }

  private clearMessageList(): void {
    this.messageListDiv.node.innerHTML = '';
  }

  private createMessageContainer(chat: IChat): HTMLDivElement {
    const messageContainer = document.createElement('div');
    messageContainer.style.display = 'flex';
    messageContainer.style.flexDirection = 'row';
    messageContainer.style.width = '100%';
    messageContainer.style.marginBottom = '5px';
    if (chat.userName === '[Server]') {
      const imageElement = this.createImageElement();
      messageContainer.appendChild(imageElement);
    } else {
      const imageElement = this.createEmptyElement();
      messageContainer.appendChild(imageElement);
    }
    const nameElement = this.createChatContainer(chat);
    messageContainer.appendChild(nameElement);
    return messageContainer;
  }

  private createImageElement(): HTMLImageElement {
    const imageElement = document.createElement('img');
    const texture = this.scene.textures.getBase64(ImageKeyEnum.StarIcon);
    imageElement.src = texture;
    imageElement.style.width = '30px';
    imageElement.style.height = '30px';
    imageElement.style.borderRadius = '50%';
    imageElement.style.paddingTop = '5px';
    return imageElement;
  }

  private createEmptyElement(): HTMLDivElement {
    const divElement = document.createElement('div');
    divElement.style.width = '30px';
    divElement.style.height = '30px';
    divElement.style.borderRadius = '50%';
    divElement.style.paddingTop = '5px';
    return divElement;
  }

  private createChatContainer(chat: IChat): HTMLDivElement {
    const mainContainer = this.createMainContainer();
    const infoContainer = this.createInfoContainer();
    const nameElement = this.createMessageUserNameElement(chat.userName);
    const dateElement = this.createDateElement(chat.date);
    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(dateElement);
    const messageElement = this.createMessageElement(chat.message);
    mainContainer.appendChild(infoContainer);
    mainContainer.appendChild(messageElement);
    return mainContainer;
  }

  private createMainContainer(): HTMLDivElement {
    const mainContainer = document.createElement('div');
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    return mainContainer;
  }

  private createInfoContainer(): HTMLDivElement {
    const infoContainer = document.createElement('div');
    infoContainer.style.display = 'flex';
    infoContainer.style.flexDirection = 'row';
    return infoContainer;
  }

  private createMessageUserNameElement(userName: string): HTMLDivElement {
    const nameElement = document.createElement('div');
    nameElement.textContent = userName;
    nameElement.style.padding = '5px';
    if (userName === '[Server]') {
      nameElement.style.color = 'yellow';
    } else {
      nameElement.style.color = 'aquamarine';
    }
    return nameElement;
  }

  private createDateElement(date: Date): HTMLDivElement {
    const dateElement = document.createElement('div');
    dateElement.textContent = formatDate(date);
    dateElement.style.padding = '5px';
    dateElement.style.color = 'white';
    return dateElement;
  }

  private createMessageElement(message: string): HTMLDivElement {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.padding = '5px';
    messageElement.style.color = 'white';
    return messageElement;
  }

  private createMessageInput(): void {
    const positionX = this.scene.cameras.main.width - 995;
    const positionY = this.scene.cameras.main.height - this.scene.cameras.main.height * 0.182;
    this.messageInput = this.scene.add.dom(
      positionX,
      positionY,
      'input',
      `
        width: 1740px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border: 3px solid black;
        background-color: rgba(255, 255, 255, 1);
        outline: none;
        color: black;
        font-family: 'ArianHeavy';
      `
    );
    this.messageInput.node.setAttribute('type', 'text');
    this.messageInput.node.setAttribute('placeholder', 'Digite sua mensagem...');
    this.messageInput.addListener('input');
  }

  private createEnterButton(): void {
    const containerWidth = this.scene.cameras.main.width * 0.95;
    const containerHeight = this.scene.cameras.main.height * 0.7;
    const closeButton = this.scene.add
      .image(containerWidth + 47, containerHeight + 110, ImageKeyEnum.EnterIcon)
      .setOrigin(1, 0)
      .setScale(0.1)
      .setFlipX(true)
      .setFlipY(true);
    closeButton.setInteractive();
    closeButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.handleAddMessage();
    });
  }
}
