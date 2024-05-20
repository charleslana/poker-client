import { IPlayer } from './IPlayer';

export interface IRoom {
  id: string;
  name: string;
  users: IPlayer[];
  ownerId?: number;
}
