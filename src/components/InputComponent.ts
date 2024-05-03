import * as Phaser from 'phaser';

export class InputComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  public createInput(
    positionX: number,
    positionY: number,
    isPassword?: boolean,
    placeholder = ''
  ): Phaser.GameObjects.DOMElement {
    const input = this.scene.add.dom(
      positionX,
      positionY,
      'input',
      `
        width: 250px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border: 1px solid black;
        background-color: rgba(255, 255, 255, 1);
        outline: none;
        color: black;
        font-family: 'ArianHeavy';
      `
    );
    input.node.setAttribute('type', 'text');
    input.node.setAttribute('placeholder', placeholder);
    input.addListener('input');
    if (isPassword) {
      input.node.setAttribute('type', 'password');
    }
    return input;
  }
}
