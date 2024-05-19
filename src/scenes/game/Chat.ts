import * as Phaser from 'phaser';
import { formatDate } from '@/utils/utils';
import { IChat } from '@/interface/IChat';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { IRoom } from '@/interface/IRoom';

export class Chat extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.create();
  }

  private room: IRoom;
  private userListDiv: Phaser.GameObjects.DOMElement;
  private messageList: IChat[] = [];
  private messageListDiv: Phaser.GameObjects.DOMElement;
  private messageInput: Phaser.GameObjects.DOMElement;

  private create(): void {
    this.createSpectators();
    this.createChat();
  }

  private createSpectators(): void {
    this.scene.add.rectangle(10, 10, 250, 250, 0xffffff, 0).setOrigin(0);
    const spectatorsText = this.scene.add.text(10, 10, 'Spectators', {
      fontFamily: 'ArianHeavy',
      fontSize: '22px',
      color: '#ffffff',
    });
    const toggleSpectatorsIcon = this.scene.add
      .image(spectatorsText.displayWidth + 20, 10, ImageKeyEnum.HideIcon)
      .setScale(0.05)
      .setOrigin(0);
    toggleSpectatorsIcon
      .setInteractive({ cursor: 'pointer' })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        const isVisible = !this.userListDiv.visible;
        this.userListDiv.setVisible(isVisible);
        toggleSpectatorsIcon.setTexture(isVisible ? ImageKeyEnum.HideIcon : ImageKeyEnum.ShowIcon);
      });
    this.userListDiv = this.scene.add
      .dom(
        10,
        40,
        'div',
        `
        width: 230px;
        height: 230px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border: 0px solid red;
        background-color: rgba(255, 255, 255, 0);
        color: black;
        font-family: 'ArianHeavy';
        overflow-y: scroll;
     `
      )
      .setOrigin(0);
    this.updateUserListDisplay();
  }

  private updateUserListDisplay(): void {
    this.clearUserList();
    this.room = {
      id: '1',
      name: 'room',
      users: Array.from({ length: 10 }, (_, index) => ({
        id: (index + 1).toString(),
        name: `User${index}`,
        watch: true,
      })),
    };
    this.room.users.forEach((user) => {
      if (user.watch) {
        const userContainer = this.createUserContainer(user.name);
        this.userListDiv.node.appendChild(userContainer);
      }
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
    const nameElement = this.createNameElement(user);
    userContainer.appendChild(nameElement);
    return userContainer;
  }

  private createNameElement(userName: string): HTMLDivElement {
    const nameElement = document.createElement('div');
    nameElement.textContent = userName;
    nameElement.style.padding = '5px';
    nameElement.style.color = 'white';
    return nameElement;
  }

  private createChat(): void {
    this.scene.add
      .rectangle(10, this.scene.cameras.main.height - 270, 300, 250, 0xffffff, 0)
      .setOrigin(0);
    const chatText = this.scene.add.text(10, this.scene.cameras.main.height - 270, 'Chats', {
      fontFamily: 'ArianHeavy',
      fontSize: '22px',
      color: '#ffffff',
    });
    const toggleChatIcon = this.scene.add
      .image(
        chatText.displayWidth + 20,
        this.scene.cameras.main.height - 270,
        ImageKeyEnum.HideIcon
      )
      .setScale(0.05)
      .setOrigin(0);
    toggleChatIcon
      .setInteractive({ cursor: 'pointer' })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        const isVisible = !this.messageListDiv.visible;
        this.messageListDiv.setVisible(isVisible);
        this.messageInput.setVisible(isVisible);
        toggleChatIcon.setTexture(isVisible ? ImageKeyEnum.HideIcon : ImageKeyEnum.ShowIcon);
      });
    this.messageListDiv = this.scene.add
      .dom(
        10,
        this.scene.cameras.main.height - 240,
        'div',
        `
        width: 275px;
        height: 180px;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-right: 10px;
        font-size: 18px;
        border: none;
        border: 0px solid red;
        background-color: rgba(255, 255, 255, 0);
        color: black;
        font-family: 'ArianHeavy';
        overflow-y: scroll;
        word-break: break-word;
     `
      )
      .setOrigin(0);
    this.createMessageInput();
    this.updateMessageListDisplay();
  }

  private createMessageInput(): void {
    this.messageInput = this.scene.add
      .dom(
        10,
        this.scene.cameras.main.height - 40,
        'input',
        `
        width: 275px;
        height: 10px;
        padding: 10px;
        font-size: 18px;
        border: none;
        border: 0px solid green;
        background-color: rgba(255, 255, 255, 0);
        outline: none;
        color: white;
        font-family: 'ArianHeavy';
      `
      )
      .setOrigin(0);
    this.messageInput.node.setAttribute('type', 'text');
    this.messageInput.node.setAttribute('placeholder', 'Digite sua mensagem aqui');
    const style = document.createElement('style');
    style.innerHTML = `
    input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    `;
    document.head.appendChild(style);
    this.messageInput.addListener('input');
  }

  private updateMessageListDisplay(): void {
    this.clearMessageList();
    this.messageList = Array.from({ length: 10 }, (_, index) => ({
      date: new Date(),
      message: `Hello, how are you? I am great! ${index + 1}`,
      user: {
        id: (index + 1).toString(),
        name: 'user',
      },
    }));
    this.messageList.forEach((chat) => {
      const messageContainer = this.createMessageContainer(chat);
      this.messageListDiv?.node.appendChild(messageContainer);
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
    const nameElement = this.createChatContainer(chat);
    messageContainer.appendChild(nameElement);
    return messageContainer;
  }

  private createChatContainer(chat: IChat): HTMLDivElement {
    const mainContainer = this.createMainContainer();
    const infoContainer = this.createInfoContainer();
    const nameElement = this.createMessageUserNameElement(chat.user.name);
    const dateElement = this.createDateElement(new Date(chat.date));
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
    nameElement.style.color = 'aquamarine';
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
}
