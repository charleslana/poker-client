export interface IInput {
  positionX: number;
  positionY: number;
  type: 'text' | 'password' | 'email';
  placeholder?: string;
}
