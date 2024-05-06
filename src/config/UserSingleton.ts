import { IGetUser } from '@/interface/IUser';

export class UserSingleton {
  private constructor() {}

  private static instance: IGetUser | null = null;

  static getInstance(): IGetUser {
    if (UserSingleton.instance === null) {
      UserSingleton.instance = <IGetUser>{};
    }
    return UserSingleton.instance;
  }

  static setUser(user: IGetUser): void {
    UserSingleton.instance = user;
  }
}
