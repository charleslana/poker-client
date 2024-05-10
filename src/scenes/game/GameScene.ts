import { Hand } from './Hand';
import { IGetUser } from '@/interface/IUser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { IRoom } from '@/interface/IRoom';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';
import { Socket } from 'socket.io-client';
import { SocketSingleton } from '@/config/SocketSingleton';
import { UserSingleton } from '@/config/UserSingleton';

export class GameScene extends Scene {
  constructor() {
    super(SceneKeyEnum.GameScene);
  }

  private socket: Socket;
  private room: IRoom;
  private user: IGetUser;

  init(data: IRoom): void {
    this.room = data;
    this.user = UserSingleton.getInstance();
    console.log(this.room);
  }

  create(): void {
    this.socket = SocketSingleton.getInstance();
    this.handleSocket();
    this.handleGetRoom();
    this.createBg();
    this.createCloseButton();
    const hand1 = new Hand(this);
    hand1.changeBlind('small');
  }

  private handleSocket(): void {
    this.socket.on('connect', () => {
      this.socket.emit('updateUserName', this.user.name || this.socket.id, this.user.id);
      console.log('Conectado ao servidor Socket.io');
    });
    this.socket.on('disconnect', () => {
      console.log('Desconectado do servidor Socket.io');
    });
  }

  private handleGetRoom(): void {
    this.socket.on('getRoom', (room: IRoom) => {
      this.room = room;
      console.log('get room:', room);
    });
  }

  private createBg(): void {
    const gameBg = this.add.image(0, 0, ImageKeyEnum.GameBg).setOrigin(0);
    gameBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createCloseButton(): void {
    const closeButton = this.add
      .image(this.cameras.main.width - 10, 10, ImageKeyEnum.CloseIcon)
      .setOrigin(1, 0);
    closeButton.setInteractive({ cursor: 'pointer' });
    closeButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.backToLobby();
    });
  }

  private backToLobby(): void {
    const user = UserSingleton.getInstance();
    this.socket.emit('leaveRoom', this.room.id, user.name);
    this.socket.on('leaveRoomSuccess', () => {
      this.socket.off('getRoom');
      this.socket.off('leaveRoomSuccess');
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.scene.start(SceneKeyEnum.LobbyScene);
    });
  }

  // private flip(): void {
  //   const timeline = this.add.timeline([
  //     // {
  //     //   at: 0,
  //     //   tween: {
  //     //     targets: this.firstCard,
  //     //     scale: 0.7,
  //     //     duration: 300,
  //     //   },
  //     // },
  //     {
  //       at: 0,
  //       tween: {
  //         targets: this.firstCard,
  //         scaleX: 0,
  //         duration: 300,
  //         delay: 200,
  //         onComplete: () => {
  //           this.firstCard.setTexture(ImageKeyEnum.Card2OfClubs);
  //         },
  //       },
  //     },
  //     {
  //       at: 0,
  //       tween: {
  //         targets: this.secondCard,
  //         scaleX: 0,
  //         duration: 300,
  //         delay: 200,
  //         onComplete: () => {
  //           this.secondCard.setTexture(ImageKeyEnum.Card3OfClubs);
  //         },
  //       },
  //     },
  //     // {
  //     //   at: 800,
  //     //   tween: {
  //     //     targets: this.firstCard,
  //     //     scaleX: 0.7,
  //     //     duration: 300,
  //     //   },
  //     // },
  //     {
  //       at: 500,
  //       tween: {
  //         targets: this.firstCard,
  //         scale: 0.5,
  //         duration: 300,
  //       },
  //     },
  //     {
  //       at: 500,
  //       tween: {
  //         targets: this.secondCard,
  //         scale: 0.5,
  //         duration: 300,
  //       },
  //     },
  //   ]);
  //   timeline.play();
  // }
}
