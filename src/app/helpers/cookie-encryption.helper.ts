import { Injectable, inject } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})

/**
 * Utiliza API Web Crypto para encriptar y desencriptar cookies, disponible en navegador.
 */
export class CookieEncryptionHelper {
  private secretKey!: CryptoKey
  private readonly cookieService = inject(CookieService)

  // generación de secret key
  constructor () {
    const password = environment.SECRET_PASSWORD
    void this.generateSecretKey(password).then(key => {
      this.secretKey = key
    })
  }

  private async generateSecretKey (password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' }, // encrypt algorithm PBKDF2
      false,
      ['deriveKey']
    )
    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: passwordBuffer,
        iterations: 1000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 }, // encriptado / desencriptado de cookie con algoritmo AES-GCM
      true,
      ['encrypt', 'decrypt']
    )
  }

  async setSecureCookie (name: string, value: string): Promise<void> {
    const encoder = new TextEncoder()
    const valueBuffer = encoder.encode(value)
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encryptedValueBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.secretKey,
      valueBuffer
    )
    const encryptedValueArray = new Uint8Array(encryptedValueBuffer)
    const encryptedValue = btoa(String.fromCharCode(...encryptedValueArray))
    this.cookieService.set(name, encryptedValue)
  }

  async getSecureCookie (name: string): Promise<string> {
    const encryptedValue = this.cookieService.get(name)
    const encryptedValueArray = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0))
    const iv = encryptedValueArray.slice(0, 12)
    const encryptedValueBuffer = encryptedValueArray.slice(12).buffer
    const valueBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.secretKey,
      encryptedValueBuffer
    )
    const decoder = new TextDecoder()
    const originalValue = decoder.decode(valueBuffer)
    return originalValue
  }
}
