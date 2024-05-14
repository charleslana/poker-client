import { Hand } from '@/scenes/game/Hand';

export interface IPlayer {
  id: string;
  name: string;
  hand?: Hand;
}
