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
  private mainCenterX: number;
  private mainCenterY: number;
  private firstCard: Phaser.GameObjects.Image;
  private secondCard: Phaser.GameObjects.Image;

  init(data: IRoom): void {
    this.room = data;
    this.user = UserSingleton.getInstance();
    console.log(this.room);
    this.mainCenterX = this.cameras.main.width / 2;
    this.mainCenterY = this.cameras.main.height / 2;
  }

  create(): void {
    this.socket = SocketSingleton.getInstance();
    this.handleSocket();
    this.handleGetRoom();
    this.createBg();
    this.createCloseButton();
    this.createUserLocation();
    this.add
      .text(this.mainCenterX, this.mainCenterY, `GameScene room name: ${this.room.name}`, {
        color: '#000000',
      })
      .setOrigin(0.5);
    this.input.on(Phaser.Input.Events.POINTER_UP, () => {
      this.flip();
    });
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

  private createUserLocation(): void {
    const container = this.add.container(this.mainCenterX, this.mainCenterY + 200);

    const defaultRectangle = this.add.rectangle(0, 0, 170, 170, 0xffffff, 0).setOrigin(0.5);

    const cardsRectangle = this.add
      .rectangle(
        defaultRectangle.displayOriginX - defaultRectangle.displayWidth,
        defaultRectangle.displayOriginY - defaultRectangle.displayHeight,
        100,
        100,
        0xff0000,
        0
      )
      .setOrigin(0, 0);

    this.firstCard = this.add
      .image(
        defaultRectangle.displayOriginX - defaultRectangle.displayWidth - 40,
        defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 20,
        ImageKeyEnum.CardBack1
      )
      .setScale(0.5)
      .setOrigin(0)
      .setRotation(-0.3);

    this.secondCard = this.add
      .image(
        defaultRectangle.displayOriginX - defaultRectangle.displayWidth + 20,
        defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 20,
        ImageKeyEnum.CardBack1
      )
      .setScale(0.5)
      .setOrigin(-0.25, 0.25)
      .setRotation(0.3);

    const dealerRectangle = this.add
      .rectangle(
        defaultRectangle.displayOriginX -
          defaultRectangle.displayWidth +
          cardsRectangle.displayWidth,
        defaultRectangle.displayOriginY - defaultRectangle.displayHeight,
        70,
        50,
        0x0000ff,
        0
      )
      .setOrigin(0);

    const dealerContainer = this.add.container(
      defaultRectangle.displayOriginX -
        defaultRectangle.displayWidth +
        cardsRectangle.displayWidth +
        4,
      defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 95
    );

    const dealerButton = this.add.graphics();
    dealerButton.fillStyle(0x6785f7, 1);
    dealerButton.fillRoundedRect(
      defaultRectangle.displayOriginX -
        defaultRectangle.displayWidth +
        cardsRectangle.displayWidth +
        3,
      defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 2,
      25,
      25,
      12.5
    );
    dealerButton.lineStyle(2, 0x0e1671);
    dealerButton.strokeRoundedRect(
      defaultRectangle.displayOriginX -
        defaultRectangle.displayWidth +
        cardsRectangle.displayWidth +
        2,
      defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 2,
      26,
      26,
      13
    );

    const dealerText = this.add
      .text(
        defaultRectangle.displayOriginX -
          defaultRectangle.displayWidth +
          cardsRectangle.displayWidth +
          5,
        defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 4.5,
        'D',
        {
          fontFamily: 'ArianHeavy',
          fontSize: '22px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0);

    dealerContainer.add([dealerButton, dealerText]);

    const blindRectangle = this.add
      .rectangle(
        defaultRectangle.displayOriginX -
          defaultRectangle.displayWidth +
          cardsRectangle.displayWidth,
        defaultRectangle.displayOriginY -
          defaultRectangle.displayHeight +
          dealerRectangle.displayHeight,
        70,
        50,
        0x008000,
        0
      )
      .setOrigin(0);

    const blindContainer = this.add.container(
      defaultRectangle.displayOriginX -
        defaultRectangle.displayWidth +
        cardsRectangle.displayWidth +
        4,
      defaultRectangle.displayOriginY -
        defaultRectangle.displayHeight +
        dealerRectangle.displayHeight +
        95
    );

    // const blindButton = this.add.graphics();
    // blindButton.fillStyle(0x1db622, 1);
    // blindButton.fillRoundedRect(
    //   defaultRectangle.displayOriginX -
    //     defaultRectangle.displayWidth +
    //     cardsRectangle.displayWidth +
    //     3,
    //   defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 2,
    //   25,
    //   25,
    //   12.5
    // );
    // blindButton.lineStyle(2, 0x003000);
    // blindButton.strokeRoundedRect(
    //   defaultRectangle.displayOriginX -
    //     defaultRectangle.displayWidth +
    //     cardsRectangle.displayWidth +
    //     2,
    //   defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 2,
    //   26,
    //   26,
    //   13
    // );

    const blindButton = this.add.graphics();
    blindButton.fillStyle(0xff4602, 1);
    blindButton.fillRoundedRect(
      defaultRectangle.displayOriginX -
        defaultRectangle.displayWidth +
        cardsRectangle.displayWidth +
        3,
      defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 2,
      25,
      25,
      12.5
    );
    blindButton.lineStyle(2, 0x781a0f);
    blindButton.strokeRoundedRect(
      defaultRectangle.displayOriginX -
        defaultRectangle.displayWidth +
        cardsRectangle.displayWidth +
        2,
      defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 2,
      26,
      26,
      13
    );

    const blindText = this.add
      .text(
        defaultRectangle.displayOriginX -
          defaultRectangle.displayWidth +
          cardsRectangle.displayWidth +
          4,
        defaultRectangle.displayOriginY - defaultRectangle.displayHeight + 8.5,
        'BB',
        {
          fontFamily: 'ArianHeavy',
          fontSize: '13px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0);

    blindContainer.add([blindButton, blindText]);

    const infoPlayerRectangle = this.add
      .rectangle(
        defaultRectangle.displayOriginX - defaultRectangle.displayWidth,
        defaultRectangle.displayOriginY -
          defaultRectangle.displayHeight +
          cardsRectangle.displayHeight,
        100,
        35,
        0x993399,
        1
      )
      .setOrigin(0);

    const playerChipsRectangle = this.add
      .rectangle(
        defaultRectangle.displayOriginX - defaultRectangle.displayWidth,
        defaultRectangle.displayOriginY -
          defaultRectangle.displayHeight +
          cardsRectangle.displayHeight +
          infoPlayerRectangle.displayHeight,
        100,
        35,
        0x808080,
        1
      )
      .setOrigin(0);

    const chipsImageRectangle = this.add
      .rectangle(
        defaultRectangle.displayOriginX -
          defaultRectangle.displayWidth +
          infoPlayerRectangle.displayWidth,
        defaultRectangle.displayOriginY -
          defaultRectangle.displayHeight +
          cardsRectangle.displayHeight,
        70,
        70,
        0xffd700,
        0
      )
      .setOrigin(0);

    const chips = this.add
      .image(
        defaultRectangle.displayOriginX -
          defaultRectangle.displayWidth +
          infoPlayerRectangle.displayWidth,
        defaultRectangle.displayOriginY -
          defaultRectangle.displayHeight +
          cardsRectangle.displayHeight +
          14,
        ImageKeyEnum.ChipsIcon
      )
      .setScale(0.14)
      .setOrigin(0);

    const handRectangle = this.add
      .rectangle(
        defaultRectangle.displayOriginX - defaultRectangle.displayWidth,
        defaultRectangle.displayOriginY -
          defaultRectangle.displayHeight +
          cardsRectangle.displayHeight +
          playerChipsRectangle.displayHeight +
          35,
        170,
        35,
        0x964b00,
        1
      )
      .setOrigin(0);

    container.add([
      defaultRectangle,
      cardsRectangle,
      this.firstCard,
      this.secondCard,
      dealerRectangle,
      dealerContainer,
      blindRectangle,
      blindContainer,
      infoPlayerRectangle,
      playerChipsRectangle,
      chipsImageRectangle,
      chips,
      handRectangle,
    ]);
  }

  private flip(): void {
    const timeline = this.add.timeline([
      // {
      //   at: 0,
      //   tween: {
      //     targets: this.firstCard,
      //     scale: 0.7,
      //     duration: 300,
      //   },
      // },
      {
        at: 0,
        tween: {
          targets: this.firstCard,
          scaleX: 0,
          duration: 300,
          delay: 200,
          onComplete: () => {
            this.firstCard.setTexture(ImageKeyEnum.Card2OfClubs);
          },
        },
      },
      {
        at: 0,
        tween: {
          targets: this.secondCard,
          scaleX: 0,
          duration: 300,
          delay: 200,
          onComplete: () => {
            this.secondCard.setTexture(ImageKeyEnum.Card3OfClubs);
          },
        },
      },
      // {
      //   at: 800,
      //   tween: {
      //     targets: this.firstCard,
      //     scaleX: 0.7,
      //     duration: 300,
      //   },
      // },
      {
        at: 500,
        tween: {
          targets: this.firstCard,
          scale: 0.5,
          duration: 300,
        },
      },
      {
        at: 500,
        tween: {
          targets: this.secondCard,
          scale: 0.5,
          duration: 300,
        },
      },
    ]);
    timeline.play();
  }
}
