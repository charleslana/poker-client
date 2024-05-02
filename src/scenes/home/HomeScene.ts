import * as Phaser from 'phaser';
import AuthService from '@/service/AuthService';
import UserService from '@/service/UserService';
import { ButtonComponent } from '@/components/ButtonComponent';
import { ChangeNameDialog } from './ChangeNameDialog';
import { ImageKeyEnum } from '@/enum/ImageKeyEnum';
import { isAuthenticated, saveAccessToken } from '@/utils/localStorageUtils';
import { LoginDialog } from './LoginDialog';
import { RegisterDialog } from './RegisterDialog';
import { Scene } from 'phaser';
import { SceneKeyEnum } from '@/enum/SceneKeyEnum';

export class HomeScene extends Scene {
  constructor() {
    super(SceneKeyEnum.HomeScene);
  }

  private mainCenterX: number;
  private mainCenterY: number;
  private registerDialog: RegisterDialog;
  private loginDialog: LoginDialog;
  private changeNameDialog: ChangeNameDialog;
  private buttonComponent: ButtonComponent;
  private registerButton: Phaser.GameObjects.Container;
  private loginButton: Phaser.GameObjects.Container;
  private loadingImage: Phaser.GameObjects.Image;
  private loadingText: Phaser.GameObjects.Text;

  init(): void {
    this.mainCenterX = this.cameras.main.width / 2;
    this.mainCenterY = this.cameras.main.height / 2;
    this.createBg();
    this.createUI();
    this.createLoading();
    this.hideLoading();
  }

  create(): void {
    if (isAuthenticated()) {
      this.getUserMe();
    }
  }

  private createBg(): void {
    const bootBg = this.add.image(0, 0, ImageKeyEnum.HomeBg).setOrigin(0);
    bootBg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
  }

  private createUI(): void {
    this.createLogoText();
    this.buttonComponent = new ButtonComponent(this);
    this.registerButton = this.buttonComponent.createButton(
      this.mainCenterX - 300,
      this.mainCenterY + 100,
      'Cadastrar'
    );
    this.registerButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.showRegisterDialog();
    });
    this.loginButton = this.buttonComponent.createButton(
      this.mainCenterX + 100,
      this.mainCenterY + 100,
      'Logar'
    );
    this.loginButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.showLoginDialog();
    });
    this.createFooterText();
  }

  private createLogoText(): void {
    const pokerText = this.add
      .text(this.mainCenterX, this.mainCenterY - 100, 'Poker', {
        fontFamily: 'Bebas',
        fontSize: '82px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);
    this.add
      .text(pokerText.x + pokerText.width / 2, pokerText.y + pokerText.height / 2, 'com amigos', {
        fontFamily: 'ArianHeavy',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0, 0.5);
  }

  private createFooterText(): void {
    this.add
      .text(10, this.cameras.main.height - 20, 'Criado por Charles Lana', {
        fontFamily: 'ArianHeavy',
        fontSize: '16px',
        color: '#ffffff',
        align: 'left',
      })
      .setOrigin(0, 1);
    this.add
      .text(this.cameras.main.width - 10, this.cameras.main.height - 20, 'Versão 0.0.1', {
        fontFamily: 'ArianHeavy',
        fontSize: '16px',
        color: '#ffffff',
        align: 'right',
      })
      .setOrigin(1, 1);
  }

  private showRegisterDialog(): void {
    this.registerDialog = new RegisterDialog(this);
    this.registerDialog.on(
      this.registerDialog.event,
      (email: string, password: string) => this.auth(email, password),
      this
    );
  }

  private async auth(email: string, password: string): Promise<void> {
    try {
      const accessToken = await AuthService.login(email, password);
      saveAccessToken(accessToken);
      await this.getUserMe();
    } catch (error) {
      console.log(error);
    }
  }

  private showLoginDialog(): void {
    this.loginDialog = new LoginDialog(this);
    this.loginDialog.on(this.loginDialog.event, this.getUserMe, this);
  }

  private async getUserMe(): Promise<void> {
    this.hideRegisterLoginButton();
    this.showLoading();
    try {
      const getUserMe = await UserService.getMe();
      if (!getUserMe.name) {
        this.showChangeNameDialog();
        return;
      }
      this.goToLobby();
    } catch (error) {
      console.log(error);
      this.showRegisterLoginButton();
    } finally {
      this.hideLoading();
    }
  }

  private hideRegisterLoginButton(): void {
    this.registerButton.setVisible(false);
    this.loginButton.setVisible(false);
  }

  private showRegisterLoginButton(): void {
    this.registerButton.setVisible(true);
    this.loginButton.setVisible(true);
  }

  private hideLoading(): void {
    this.loadingImage.setVisible(false);
    this.loadingText.setVisible(false);
  }

  private showLoading(): void {
    this.loadingImage.setVisible(true);
    this.loadingText.setVisible(true);
  }

  private createLoading() {
    this.loadingImage = this.add
      .image(this.mainCenterX, this.mainCenterY, ImageKeyEnum.Loading)
      .setScale(0.2);
    this.loadingText = this.add.text(this.mainCenterX + 130, this.mainCenterY, 'Carregando...', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
    });
    this.loadingImage.setOrigin(0.5);
    this.loadingText.setOrigin(0.5);
  }

  private showChangeNameDialog(): void {
    this.changeNameDialog = new ChangeNameDialog(this);
    this.changeNameDialog.on(this.changeNameDialog.event, this.goToLobby, this);
    this.changeNameDialog.on(this.changeNameDialog.logoutEvent, this.restart, this);
  }

  private goToLobby(): void {
    this.scene.start(SceneKeyEnum.LobbyScene);
  }

  private restart(): void {
    this.scene.restart();
  }
}
