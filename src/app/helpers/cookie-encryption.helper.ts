import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

/**
 * Utiliza API Web Crypto para encriptar y desencriptar cookies, disponible en navegador.
 */
export class CookieEncryptionHelper {

  private secretKey!: CryptoKey;

  //generación de secret key
  constructor(private cookieService: CookieService) {
    this.generateSecretKey('your-password').then(key => {
      this.secretKey = key;
    });
  }

  private async generateSecretKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' }, //encrypt algorithm PBKDF2
      false,
      ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: passwordBuffer,
        iterations: 1000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },//encriptado / desencriptado de cookie con algoritmo AES-GCM
      true,
      ['encrypt', 'decrypt']
    );
  }

  async setSecureCookie(name: string, value: string): Promise<void> {
    const encoder = new TextEncoder();
    const valueBuffer = encoder.encode(value);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedValueBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      this.secretKey,
      valueBuffer
    );
    const encryptedValueArray = new Uint8Array(encryptedValueBuffer);
    const encryptedValue = btoa(String.fromCharCode(...encryptedValueArray));
    this.cookieService.set(name, encryptedValue);
  }

  async getSecureCookie(name: string): Promise<string> {
    const encryptedValue = this.cookieService.get(name);
    const encryptedValueArray = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0));
    const iv = encryptedValueArray.slice(0, 12);
    const encryptedValueBuffer = encryptedValueArray.slice(12).buffer;
    const valueBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      this.secretKey,
      encryptedValueBuffer
    );
    const decoder = new TextDecoder();
    const originalValue = decoder.decode(valueBuffer);
    return originalValue;
  }
}




/*  //------------
  /!**
   * Clave secreta utilizada para la encriptación y desencriptación.
   *!/
  private secretKey: string;
  /!**
   * @param cookieService - Servicio para manejar cookies.
   *!/
  constructor( private cookieService: CookieService ) { 
    this.secretKey = crypto.randomBytes(32).toString('hex'); 
  }

  /!**
   * Encripta un valor utilizando AES-256-CBC.
   * @param value - El valor a encriptar.
   * @returns El valor encriptado.
   *!/
  encryptValue(value: string): string {
    let cipher = crypto.createCipher('aes-256-cbc', this.secretKey);
    let encryptedValue = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
    return encryptedValue;
  }

  /!**
   * Establece una cookie con un valor encriptado.
   * @param name - El nombre de la cookie.
   * @param value - El valor a encriptar y almacenar en la cookie.
   *!/
  setEncryptedCookie(name: string, value: string): void {
    const encryptedValue = this.encryptValue(value);
    this.cookieService.set(name, encryptedValue); 
  
  }

   /!**
   * Desencripta un valor.
   * @param encryptedValue - El valor encriptado.
   * @returns El valor desencriptado.
   *!/
  decryptValue(encryptedValue: string): string {
    let decipher = crypto.createDecipher('aes-256-cbc', this.secretKey);
    let decryptedValue = decipher.update(encryptedValue, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedValue;
  }*/







