import * as Phaser from 'phaser';

export class RegisterDialogComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.createBlocker();
    this.createOverlay();
    this.createModalBackground();
    this.createText();
    this.createEmailInput();
    this.createPasswordInput();
    this.createButton();
  }

  public event = 'event';

  private blocker: Phaser.GameObjects.Rectangle;
  private overlay: Phaser.GameObjects.Rectangle;
  private modalBackground: Phaser.GameObjects.Rectangle;
  private modalX = this.scene.cameras.main.width / 2;
  private modalY = this.scene.cameras.main.height / 2;
  private text: Phaser.GameObjects.Text;
  private button: Phaser.GameObjects.Text;

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

  private createModalBackground(): void {
    this.modalBackground = this.scene.add.rectangle(this.modalX, this.modalY, 500, 400, 0xffffff);
    this.modalBackground.setOrigin(0.5);
    this.modalBackground.setDepth(998);
  }

  private createText(): void {
    this.text = this.scene.add.text(this.modalX, this.modalY - 130, 'Cadastro', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#000000',
      align: 'center',
      wordWrap: {
        width: 480,
        useAdvancedWrap: true,
      },
    });
    this.text.setOrigin(0.5);
    this.text.setDepth(999);
  }

  private createEmailInput(): void {
    // const printText = this.scene.add
    //   .text(400, 200, '', {
    //     fontSize: '12px',
    //   })
    //   .setAlpha(0)
    //   .setOrigin(0.5)
    //   .setFixedSize(100, 100);
    this.scene.add
      .text(this.modalX, this.modalY - 60, 'Digite seu e-mail abaixo', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#000000',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(999);
    const inputText = this.scene.add
      .rexInputText(this.modalX, this.modalY - 10, 10, 10, {
        type: 'input',
        text: 'example@example.com',
        fontSize: '24px',
        color: '#808080',
      })
      .resize(300, 100)
      .setOrigin(0.5)
      // .on('textchange', function (inputText: any) {
      //   printText.text = inputText.text;
      // })
      .on('focus', function () {
        console.log('On focus');
      })
      .on('blur', function () {
        console.log('On blur');
      })
      .on('click', function () {
        console.log('On click');
      })
      .on('dblclick', function () {
        console.log('On dblclick');
      });

    this.scene.input.on('pointerdown', function () {
      inputText.setBlur();
      console.log('pointerdown outside');
    });

    inputText.on('keydown', function (inputText: any, e: any) {
      if (inputText.inputType !== 'textarea' && e.key === 'Enter') {
        inputText.setBlur();
      }
    });
    // printText.text = inputText.text;
  }

  private createPasswordInput(): void {
    this.scene.add
      .text(this.modalX, this.modalY + 40, 'Digite sua senha', {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#000000',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(999);
    const inputText = this.scene.add
      .rexInputText(this.modalX, this.modalY + 80, 10, 10, {
        type: 'input',
        text: '*********',
        fontSize: '24px',
        color: '#808080',
      })
      .resize(300, 100)
      .setOrigin(0.5)
      // .on('textchange', function (inputText: any) {
      //   printText.text = inputText.text;
      // })
      .on('focus', function () {
        console.log('On focus');
      })
      .on('blur', function () {
        console.log('On blur');
      })
      .on('click', function () {
        console.log('On click');
      })
      .on('dblclick', function () {
        console.log('On dblclick');
      });

    this.scene.input.on('pointerdown', function () {
      inputText.setBlur();
      console.log('pointerdown outside');
    });

    inputText.on('keydown', function (inputText: any, e: any) {
      if (inputText.inputType !== 'textarea' && e.key === 'Enter') {
        inputText.setBlur();
      }
    });
    // printText.text = inputText.text;
  }

  private createButton(): void {
    this.button = this.scene.add.text(this.modalX, this.modalY + 150, 'Fechar', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#007bff',
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
    });
    this.button.setOrigin(0.5);
    this.button.setDepth(999);
    this.button.setInteractive({ cursor: 'pointer' });
    this.button.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.emitButton();
    });
  }

  private emitButton(): void {
    this.emit(this.event);
    this.blocker.destroy();
    this.overlay.destroy();
    this.modalBackground.destroy();
    this.text.destroy();
    this.button.destroy();
  }
}
