import * as Phaser from 'phaser';

export class ButtonComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  private container: Phaser.GameObjects.Container;

  public createButton(
    x: number,
    y: number,
    text: string,
    color?: 'green' | 'purple' | 'red'
  ): Phaser.GameObjects.Container {
    this.container = this.scene.add.container(x, y);
    const buttonText = this.createButtonText(text);
    const textWidth = buttonText.width;
    const textHeight = buttonText.height;
    let buttonWidth = textWidth + 20;
    let buttonHeight = textHeight + 20;
    buttonWidth = Math.max(buttonWidth, 200);
    buttonHeight = Math.max(buttonHeight, 50);
    const graphics = this.createBackgroundText(buttonWidth, buttonHeight, color);
    this.container.setSize(buttonWidth, buttonHeight);
    this.container.displayWidth = buttonWidth;
    this.container.displayHeight = buttonHeight;
    buttonText.setPosition(buttonWidth / 2, buttonHeight / 2);
    this.container.setInteractive({ cursor: 'pointer' });
    this.container.input!.hitArea.x += buttonWidth / 2;
    this.container.input!.hitArea.y += buttonHeight / 2;
    this.container.add([graphics, buttonText]);
    return this.container;
  }

  public hide(): void {
    this.container.setVisible(false);
  }

  private createButtonText(text: string): Phaser.GameObjects.Text {
    return this.scene.add
      .text(0, 0, text, {
        fontFamily: 'TBF',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
  }

  private createBackgroundText(
    buttonWidth: number,
    buttonHeight: number,
    color?: 'green' | 'purple' | 'red'
  ): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    switch (color) {
      case 'green':
        graphics.fillGradientStyle(0x00750c, 0x00750c, 0x00c70c, 0x00c70c, 1);
        graphics.lineStyle(5, 0x002e08);
        break;
      case 'purple':
        graphics.fillGradientStyle(0x4a0a46, 0x4a0a46, 0x62125d, 0x62125d, 1);
        graphics.lineStyle(5, 0x240523);
        break;
      case 'red':
        graphics.fillGradientStyle(0x8c1a03, 0x8c1a03, 0xf83b17, 0xf83b17, 1);
        graphics.lineStyle(5, 0x530700);
        break;
      default:
        graphics.fillGradientStyle(0x0022ff, 0x0022ff, 0x0089ff, 0x0089ff, 1);
        graphics.lineStyle(5, 0x060e64);
        break;
    }
    graphics.fillRect(2, 0, buttonWidth - 4, buttonHeight);
    graphics.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    return graphics;
  }
}
