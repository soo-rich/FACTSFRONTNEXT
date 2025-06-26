import { jwtDecode } from 'jwt-decode';
import { JwtType } from '@/types/jwt.type';

export class JwtUtils {
  static decode = (token: string) => {
    return jwtDecode<JwtType>(token);
  };

  static getexpirationdate = (token: string): Date | null => {
    const decoded = jwtDecode(token);
    if (decoded.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  };
  static isTokenExpired = (token: string): boolean => {
    const date = this.getexpirationdate(token);
    if (date === undefined) return true;
    return !(date!.valueOf() > Date.now().valueOf());
  };
}
