import api from '@/config/api';

export default class AuthService {
  private static baseUrl = '/auth/login';

  static async login(email: string, password: string): Promise<string> {
    const response = await api.post<any>(this.baseUrl, { email, password });
    return response.data.access_token;
  }
}
