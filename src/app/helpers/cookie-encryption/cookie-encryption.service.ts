import { Injectable } from '@angular/core';
import * as crypto from 'crypto-browserify';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})

export class CookieEncryptionService {

  private secretKey: string;

  constructor( private cookieService: CookieService ) { 
    this.secretKey = crypto.randomBytes(32).toString('hex'); // Genera una clave secreta aleatoria
  }

  //Encripta el valor de la cookie
  encryptValue(value: string): string {
    let cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
    let encryptedValue = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
    return encryptedValue;
  }

    
  //Establece la cookie con el valor encriptado
  setEncryptedCookie(name: string, value: string): void {
    const encryptedValue = this.encryptValue(value);
    this.cookieService.set(name, encryptedValue);
  }


  //Desencripta el valor de la cookie
  decryptValue(encryptedValue: string): string {
    let decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
    let decryptedValue = decipher.update(encryptedValue, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedValue;
  }
      


}






