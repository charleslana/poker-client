import api from '@/config/api';

export default class UserService {
  private static baseUrl = '/user';

  static async register(email: string, password: string): Promise<void> {
    const response = await api.post<void>(this.baseUrl, { email, password });
    return response.data;
  }
}
