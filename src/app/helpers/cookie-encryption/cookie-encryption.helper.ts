import { Injectable } from '@angular/core';
import * as crypto from 'crypto-browserify';
import { CookieService } from 'ngx-cookie-service';

/**
 * Servicio para la encriptación y desencriptación de cookies.
 */
@Injectable({
  providedIn: 'root'
})

export class CookieEncryptionHelper {
  /**
   * Clave secreta utilizada para la encriptación y desencriptación.
   */
  private secretKey: string;
  /**
   * @param cookieService - Servicio para manejar cookies.
   */
  constructor( private cookieService: CookieService ) { 
    this.secretKey = crypto.randomBytes(32).toString('hex'); 
  }

  /**
   * Encripta un valor utilizando AES-256-CBC.
   * @param value - El valor a encriptar.
   * @returns El valor encriptado.
   */
  encryptValue(value: string): string {
    let cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
    let encryptedValue = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
    return encryptedValue;
  }

  /**
   * Establece una cookie con un valor encriptado.
   * @param name - El nombre de la cookie.
   * @param value - El valor a encriptar y almacenar en la cookie.
   */
  setEncryptedCookie(name: string, value: string): void {
    const encryptedValue = this.encryptValue(value);
    this.cookieService.set(name, encryptedValue); 
  
  }

   /**
   * Desencripta un valor.
   * @param encryptedValue - El valor encriptado.
   * @returns El valor desencriptado.
   */
  decryptValue(encryptedValue: string): string {
    let decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
    let decryptedValue = decipher.update(encryptedValue, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedValue;
  }
}






