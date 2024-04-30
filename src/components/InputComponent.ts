import * as Phaser from 'phaser';

export class InputComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public createInput(
    positionX: number,
    positionY: number,
    isPassword?: boolean
  ): Phaser.GameObjects.DOMElement {
    const textInput = this.scene.add
      .dom(positionX, positionY)
      .createFromCache('input')
      .setOrigin(0.5);
    textInput.addListener('input');
    if (isPassword) {
      const inputElement = textInput.node.querySelector('.input-form input') as HTMLInputElement;
      inputElement.type = 'password';
    }
    return textInput;
  }
}
