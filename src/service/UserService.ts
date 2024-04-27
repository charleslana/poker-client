import api from '@/config/api';
import { IResponse } from '@/interface/IResponse';

export default class UserService {
  private static baseUrl = '/user';

  static async register(email: string, password: string): Promise<IResponse> {
    const response = await api.post<IResponse>(this.baseUrl, { email, password });
    return response.data;
  }
}
