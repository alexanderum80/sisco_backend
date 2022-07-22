import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';

const secretKey = '923767059c391daf0f7f86ec2fb4a4af';

@Injectable()
export class CryptoService {
  async encrypt(text: string) {
    const cryptr = new Cryptr(secretKey);
    return cryptr.encrypt(text);
  }

  async decrypt(text: string) {
    const cryptr = new Cryptr(secretKey);
    return cryptr.decrypt(text);
  }
}
