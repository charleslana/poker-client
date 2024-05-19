import { ButtonComponent } from '@/components/ButtonComponent';
import { Chat } from './Chat';
import { ConfirmDialog } from './ConfirmDialog';
import { Hand } from './Hand';
import { ICard } from '@/interface/ICard';
import { IGetUser } from '@/interface/IUser';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { IPlayer } from '@/interface/IPlayer';
import { IRoom } from '@/interface/IRoom';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';
import { Socket } from 'socket.io-client';
import { SocketSingleton } from '@/config/SocketSingleton';
import { TableCard } from './TableCard';
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
  private players: IPlayer[];
  private tableCards: ICard[];
  private chips: Phaser.GameObjects.Text;
  private playButton: ButtonComponent;
  private foldButton: ButtonComponent;
  private callButton: ButtonComponent;
  private riseButton: ButtonComponent;
  private checkButton: ButtonComponent;
  private watchButton: ButtonComponent;
  private playAgainButton: ButtonComponent;

  init(data: IRoom): void {
    this.mainCenterX = this.cameras.main.width / 2;
    this.mainCenterY = this.cameras.main.height / 2;
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
    this.createPlayButton();
    this.createChips();
    this.createUsersCards();
    this.createTableCards();
    new Chat(this);
  }

  private createUsersCards(): void {
    this.players = Array.from({ length: 6 }, (_, index) => ({
      id: (index + 1).toString(),
      name: `User${index}`,
    }));
    this.players.forEach((player, index) => {
      const hand = new Hand(this);
      player.hand = hand;
      hand.setContainerPosition(index);
      hand.changeUserNamePlayer(player.name);
      hand.createFlipEvents();
      hand.hideCards();
      hand.hideButtons();
    });
    // this.click();
    this.input.keyboard!.on('keydown-R', () => {
      this.scene.restart();
    });
  }

  public click(): void {
    const player = this.findPlayerById('6');
    const player2 = this.findPlayerById('2');
    const player3 = this.findPlayerById('4');
    this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
      player?.hand?.hideWinPlayer();
      this.foldButton.hide();
      this.callButton.hide();
      this.riseButton.hide();
      this.watchButton.show();
      this.showAllCards();
      player?.hand?.animateButton(player.hand.dealerContainer);
      player2?.hand?.changeBlind('big');
      player2?.hand?.animateButton(player2.hand.blindContainer);
      player3?.hand?.animateButton(player3.hand.blindContainer);
      const { x, y } = player3!.hand!.getUserTable(4);
      const tableCard = new TableCard(this);
      this.tableCards.push({
        id: this.tableCards.length + 1,
        name: `Card${this.tableCards.length}`,
        tableCard,
      });
      const lastTableCard = this.tableCards[this.tableCards.length - 1];
      lastTableCard.tableCard?.setTableCard(this.tableCards.length - 1);
      tableCard.moveCardToCenter(x, y, lastTableCard.tableCard);
    });
  }

  private showAllCards(): void {
    this.players.forEach((player, index) => {
      this.time.delayedCall(
        index * 200,
        () => {
          player?.hand?.fadeInCard(player.hand.firstCard);
          if (index === this.players.length - 1) {
            this.players.forEach((player, index) => {
              this.time.delayedCall(
                index * 200,
                () => {
                  player?.hand?.fadeInCard(player.hand.secondCard);
                },
                [],
                this
              );
            });
          }
        },
        [],
        this
      );
    });
  }

  private findPlayerById(playerId: string): IPlayer | undefined {
    return this.players.find((player) => player.id === playerId);
  }

  private createTableCards(): void {
    this.tableCards = Array.from({ length: 3 }, (_, index) => ({
      id: index,
      name: `Card${index}`,
    }));
    this.tableCards.forEach((_card, index) => {
      const tableCard = new TableCard(this);
      tableCard.setTableCard(index);
      tableCard.fadeInCard();
      // tableCard.createFlipEvent();
      const hand = new Hand(this);
      hand.hideContainer();
      const { x, y } = hand.getUserTable(6);
      hand.moveChipsToCenter(x, y, this.chips);
      // tableCard.moveCardToCenter(x, y);
    });
  }

  private createChips(): void {
    const chips = this.add
      .image(this.mainCenterX + 200, this.mainCenterY - 100, ImageKeyEnum.ChipsIcon)
      .setScale(0.14)
      .setOrigin(0);
    const chipsCenterX = chips.x + chips.displayWidth / 2;
    this.chips = this.add
      .text(chipsCenterX, chips.y + chips.displayHeight + 10, '10', {
        fontFamily: 'ArianHeavy',
        fontSize: '22px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
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
      const confirmDialog = new ConfirmDialog(this);
      confirmDialog.on(confirmDialog.event, this.backToLobby, this);
    });
  }

  private backToLobby(): void {
    const user = UserSingleton.getInstance();
    this.socket.emit('leaveRoom', this.room.id, user.name, user.id);
    this.socket.on('leaveRoomSuccess', () => {
      this.socket.off('getRoom');
      this.socket.off('leaveRoomSuccess');
      this.socket.off('connect');
      this.socket.off('disconnect');
      this.scene.start(SceneKeyEnum.LobbyScene);
    });
  }

  private createPlayButton(): void {
    this.playButton = new ButtonComponent(this);
    this.playButton.createButton(
      this.mainCenterX - 100,
      this.mainCenterY * 2 - 100,
      'Play',
      'green'
    );
    this.playButton.hide();
    this.createGameButtons();
  }

  private createGameButtons(): void {
    this.createFoldButton();
    this.createCallButton();
    this.createCheckButton();
    this.createWatchButton();
    this.createPlayAgainButton();
    this.createRiseButton();
  }

  private createFoldButton(): void {
    this.foldButton = new ButtonComponent(this);
    this.foldButton.createButton(
      this.mainCenterX - 350,
      this.mainCenterY * 2 - 100,
      'Fold',
      'purple'
    );
  }

  private createCallButton(): void {
    this.callButton = new ButtonComponent(this);
    this.callButton.createButton(this.mainCenterX - 70, this.mainCenterY * 2 - 100, 'Call');
  }

  private createCheckButton(): void {
    this.checkButton = new ButtonComponent(this);
    this.checkButton.createButton(
      this.mainCenterX - 70,
      this.mainCenterY * 2 - 100,
      'Check',
      'green'
    );
    this.checkButton.hide();
  }

  private createWatchButton(): void {
    this.watchButton = new ButtonComponent(this);
    this.watchButton.createButton(this.mainCenterX - 70, this.mainCenterY * 2 - 100, 'Watch');
    this.watchButton.hide();
  }

  private createPlayAgainButton(): void {
    this.playAgainButton = new ButtonComponent(this);
    this.playAgainButton.createButton(
      this.mainCenterX - 70,
      this.mainCenterY * 2 - 100,
      'Play Again',
      'green'
    );
    this.playAgainButton.hide();
  }

  private createRiseButton(): void {
    this.riseButton = new ButtonComponent(this);
    this.riseButton.createButton(this.mainCenterX + 200, this.mainCenterY * 2 - 100, 'Rise', 'red');
  }
}
