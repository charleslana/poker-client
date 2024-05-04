import { IPlayer } from './IPlayer';

export interface IChat {
  user: IPlayer;
  date: Date;
  message: string;
}
