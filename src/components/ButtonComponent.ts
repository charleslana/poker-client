import * as Phaser from 'phaser';

export class ButtonComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public createButton(x: number, y: number, text: string): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const buttonText = this.createButtonText(text);
    const textWidth = buttonText.width;
    const textHeight = buttonText.height;
    let buttonWidth = textWidth + 20;
    let buttonHeight = textHeight + 20;
    buttonWidth = Math.max(buttonWidth, 200);
    buttonHeight = Math.max(buttonHeight, 50);
    const graphics = this.createBackgroundText(buttonWidth, buttonHeight);
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
    buttonHeight: number
  ): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x0031ff);
    graphics.fillRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    graphics.lineStyle(2, 0x143787);
    graphics.strokeRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
    return graphics;
  }
}
