import * as Phaser from 'phaser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { IRoom } from '@/interface/IRoom';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';
import { Socket } from 'socket.io-client';
import { SocketSingleton } from '@/config/SocketSingleton';

export class JoinDialog extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createDialog();
  }

  public event = 'event';

  private blocker: Phaser.GameObjects.Rectangle;
  private overlay: Phaser.GameObjects.Rectangle;
  private modal: Phaser.GameObjects.Rectangle;
  private modalGraphics: Phaser.GameObjects.Graphics;
  private mainCenterX = this.scene.cameras.main.width / 2;
  private mainCenterY = this.scene.cameras.main.height / 2;
  private titleText: Phaser.GameObjects.Text;
  private containerDiv: Phaser.GameObjects.DOMElement;
  private roomList: IRoom[] = [];
  private selectedRoomContainer: HTMLDivElement | null = null;
  private selectedRoom: IRoom;
  private acceptButton: Phaser.GameObjects.Image;
  private deleteButton: Phaser.GameObjects.Image;
  private socket: Socket;

  private createDialog(): void {
    this.socket = SocketSingleton.getInstance();
    this.createBlocker();
    this.createOverlay();
    this.createModal();
    this.createTitleText();
    this.createContainerDiv();
    this.handleGetRooms();
    this.createAcceptButton();
    this.createDeleteButton();
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

  private createModal(): void {
    this.modal = this.scene.add.rectangle(this.mainCenterX, this.mainCenterY, 750, 600);
    this.modal.setOrigin(0.5);
    this.modal.setDepth(998);
    this.createModalGraphics();
  }

  private createModalGraphics(): void {
    this.modalGraphics = this.scene.add.graphics();
    this.modalGraphics.fillGradientStyle(0x2084fe, 0x2084fe, 0x1931a4, 0x1931a4, 1);
    this.modalGraphics.fillRect(
      this.modal.displayOriginX + 210,
      this.modal.displayOriginY - 60,
      750,
      600
    );
    this.modalGraphics.lineStyle(5, 0x49a1f1, 1);
    this.modalGraphics.strokeRoundedRect(
      this.modal.displayOriginX + 210,
      this.modal.displayOriginY - 60,
      750,
      600,
      10
    );
    this.modalGraphics.setDepth(998);
  }

  private createTitleText(): void {
    this.titleText = this.scene.add.text(
      this.mainCenterX,
      this.mainCenterY - 250,
      'Join An Existing Game Room',
      {
        fontFamily: 'ArianHeavy',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        wordWrap: {
          width: 480,
          useAdvancedWrap: true,
        },
      }
    );
    this.titleText.setOrigin(0.5);
    this.titleText.setDepth(999);
  }

  private createContainerDiv(): void {
    const positionX = this.scene.cameras.main.width / 2;
    const positionY = this.scene.cameras.main.height / 2 - 10;
    this.containerDiv = this.scene.add.dom(
      positionX,
      positionY,
      'div',
      `
        width: 600px;
        height: 360px;
        font-size: 20px;
        border: none;
        border: 5px solid white;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, 0);
        color: black;
        font-family: 'ArianHeavy';
        overflow-y: scroll;
        word-break: break-word;
     `
    );
    this.containerDiv.node.appendChild(this.createListContainer());
  }

  private handleGetRooms(): void {
    this.socket.on('allRooms', (rooms: IRoom[]) => {
      console.log('List all of rooms:', rooms);
      this.changeRoomList(rooms);
    });
    this.socket.emit('getAllRooms');
  }

  private changeRoomList(rooms: IRoom[]): void {
    this.roomList = rooms;
    this.updateRoomListDisplay();
  }

  private updateRoomListDisplay(): void {
    this.clearRoomList();
    this.containerDiv.node.appendChild(this.createListContainer());
  }

  private clearRoomList(): void {
    this.containerDiv.node.innerHTML = '';
  }

  private createListContainer(): HTMLDivElement {
    const mainContainer = document.createElement('div');
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    mainContainer.style.background = '#000342';
    this.roomList.forEach((room) => {
      const roomContainer = this.createRoomContainer(room);
      roomContainer.addEventListener('click', () => {
        this.handleRoomContainerClick(roomContainer);
        this.selectedRoom = room;
      });
      mainContainer.appendChild(roomContainer);
    });
    return mainContainer;
  }

  private createRoomContainer(room: IRoom): HTMLDivElement {
    const roomContainer = document.createElement('div');
    roomContainer.style.borderBottom = '2px solid grey';
    roomContainer.style.padding = '10px';
    roomContainer.style.cursor = 'pointer';
    const roomName = this.createRoomName(room.name);
    const infoContainer = this.createInfoContainer();
    const blinds = this.createBlinds(room.users.length);
    const players = this.createPlayers(room.users.length);
    roomContainer.appendChild(roomName);
    infoContainer.appendChild(blinds);
    infoContainer.appendChild(players);
    roomContainer.appendChild(infoContainer);
    return roomContainer;
  }

  private createRoomName(name: string): HTMLDivElement {
    const roomName = document.createElement('div');
    roomName.textContent = name;
    roomName.style.color = 'yellow';
    return roomName;
  }

  private createInfoContainer(): HTMLDivElement {
    const infoContainer = document.createElement('div');
    infoContainer.style.display = 'flex';
    infoContainer.style.flexDirection = 'row';
    infoContainer.style.justifyContent = 'space-around';
    return infoContainer;
  }

  private createBlinds(playersCount: number): HTMLDivElement {
    const blinds = document.createElement('div');
    blinds.textContent = `Blinds: ${playersCount}/2`;
    blinds.style.color = '#1a905e';
    return blinds;
  }

  private createPlayers(playersCount: number): HTMLDivElement {
    const players = document.createElement('div');
    players.textContent = `Players: ${playersCount}`;
    players.style.color = '#2e8afd';
    return players;
  }

  private handleRoomContainerClick(roomContainer: HTMLDivElement): void {
    if (this.selectedRoomContainer) {
      this.selectedRoomContainer.style.background = '';
    }
    roomContainer.style.background = '#000782';
    this.selectedRoomContainer = roomContainer;
  }

  private createAcceptButton(): void {
    this.acceptButton = this.scene.add
      .image(this.mainCenterX - 200, this.mainCenterY + 205, ImageKeyEnum.AcceptIcon)
      .setScale(0.15)
      .setOrigin(0);
    this.acceptButton.setDepth(999);
    this.acceptButton.setInteractive({ cursor: 'pointer' });
    this.acceptButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.handleJoinRoom();
    });
  }

  private handleJoinRoom(): void {
    if (this.selectedRoom) {
      this.socket.on('joinRoomSuccess', (room: IRoom) => {
        this.socket.off('allUsers');
        this.socket.off('lastMessage');
        this.socket.off('allRooms');
        this.socket.off('joinRoomSuccess');
        this.socket.off('joinLobbySuccess');
        this.socket.off('connect');
        this.socket.off('disconnect');
        this.scene.scene.start(SceneKeyEnum.GameScene, room);
      });
      this.socket.emit('joinRoom', this.selectedRoom.id);
    }
  }

  private createDeleteButton(): void {
    this.deleteButton = this.scene.add
      .image(this.mainCenterX + 130, this.mainCenterY + 205, ImageKeyEnum.DeleteIcon)
      .setScale(0.15)
      .setOrigin(0);
    this.deleteButton.setDepth(999);
    this.deleteButton.setInteractive({ cursor: 'pointer' });
    this.deleteButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.closeModal();
    });
  }

  private closeModal(): void {
    this.emitEvent();
    this.blocker.destroy();
    this.overlay.destroy();
    this.modal.destroy();
    this.modalGraphics.destroy();
    this.titleText.destroy();
    this.containerDiv.destroy();
    this.acceptButton.destroy();
    this.deleteButton.destroy();
    this.socket.off('allRooms');
  }

  private emitEvent(): void {
    this.emit(this.event);
  }
}
