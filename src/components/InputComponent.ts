import * as Phaser from 'phaser';
import { IInput } from '@interface/IInput';

export class InputComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public createInput(input: IInput): Phaser.GameObjects.Text {
    return this.scene.add
      .rexInputText(input.positionX, input.positionY, 10, 10, {
        type: input.type,
        placeholder: input.placeholder,
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
        borderBottom: '1px solid #ffffff',
      })
      .resize(300, 50)
      .setOrigin(0.5);
  }
}
