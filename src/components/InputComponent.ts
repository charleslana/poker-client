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
    const input = this.scene.add.dom(
      positionX,
      positionY,
      'input',
      `
        width: 250px;
        padding: 10px;
        font-size: 20px;
        border: none;
        border-bottom: 1px solid white;
        background-color: rgba(255, 255, 255, 0);
        outline: none;
        color: white;
        font-family: 'Roboto';
      `
    );
    input.node.setAttribute('type', 'text');
    input.node.setAttribute('placeholder', 'Preencha');
    input.addListener('input');
    if (isPassword) {
      input.node.setAttribute('type', 'password');
    }
    return input;
  }
}
