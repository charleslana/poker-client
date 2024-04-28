import api from '@/config/api';
import { IGetUser } from '@/interface/IUser';

export default class UserService {
  private static baseUrl = '/user';

  static async register(email: string, password: string): Promise<void> {
    const response = await api.post<void>(this.baseUrl, { email, password });
    return response.data;
  }

  static async getMe(): Promise<IGetUser> {
    const response = await api.get<IGetUser>(`${this.baseUrl}/profile/me`);
    return response.data;
  }

  static async updateName(name: string): Promise<void> {
    const response = await api.put<void>(this.baseUrl, { name });
    return response.data;
  }
}
