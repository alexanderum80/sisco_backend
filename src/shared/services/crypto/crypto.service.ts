import { Injectable } from '@nestjs/common';
import * as Cryptr from 'cryptr';

const secretKey = '923767059c391daf0f7f86ec2fb4a4af';
const cryptr = new Cryptr(secretKey);

@Injectable()
export class CryptoService {
    async encrypt(text) {
        return cryptr.encrypt(text);
    }

    async decrypt(text) {
        return cryptr.decrypt(text);
    }
}
