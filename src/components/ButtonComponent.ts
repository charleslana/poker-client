import * as Phaser from 'phaser';

export class ButtonComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public createButton(
    x: number,
    y: number,
    text: string,
    color?: 'green' | 'gray' | 'red'
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const buttonText = this.createButtonText(text);
    const textWidth = buttonText.width;
    const textHeight = buttonText.height;
    let buttonWidth = textWidth + 20;
    let buttonHeight = textHeight + 20;
    buttonWidth = Math.max(buttonWidth, 200);
    buttonHeight = Math.max(buttonHeight, 50);
    const graphics = this.createBackgroundText(buttonWidth, buttonHeight, color);
    container.setSize(buttonWidth, buttonHeight);
    container.displayWidth = buttonWidth;
    container.displayHeight = buttonHeight;
    buttonText.setPosition(buttonWidth / 2, buttonHeight / 2);
    container.setInteractive({ cursor: 'pointer' });
    container.input!.hitArea.x += buttonWidth / 2;
    container.input!.hitArea.y += buttonHeight / 2;
    container.add([graphics, buttonText]);
    return container;
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
    color?: 'green' | 'gray' | 'red'
  ): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    switch (color) {
      case 'green':
        graphics.fillGradientStyle(0x00750c, 0x00750c, 0x00c70c, 0x00c70c, 1);
        graphics.lineStyle(5, 0x002e08);
        break;
      case 'gray':
        graphics.fillGradientStyle(0x585858, 0x585858, 0x8c8c8c, 0x8c8c8c, 1);
        graphics.lineStyle(5, 0x484a49);
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
