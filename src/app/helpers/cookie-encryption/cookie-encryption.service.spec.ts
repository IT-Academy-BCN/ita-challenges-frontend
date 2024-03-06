import { TestBed } from '@angular/core/testing';
import { CookieEncryptionService } from './cookie-encryption.service';
import { CookieService } from 'ngx-cookie-service';
import * as crypto from 'crypto-browserify';

jest.mock('crypto-browserify', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('randomKey')
  }),
  createCipher: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue('encryptedValuePart'),
    final: jest.fn().mockReturnValue('encryptedValueFinal')
  }),
  createDecipher: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue('decryptedValuePart'),
    final: jest.fn().mockReturnValue('decryptedValueFinal')
  }),
}));

describe('CookieEncryptionService', () => {
  let service: CookieEncryptionService;
  let mockCookieService: any;

  beforeEach(() => {
    // Crea un objeto con funciones simuladas para cada método en CookieService
    mockCookieService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: CookieService, useValue: mockCookieService },
      ],
    });

    // Crea una nueva instancia del servicio con el servicio de cookies simulado
    service = new CookieEncryptionService(mockCookieService);

  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt value', () => {
    const result = service.encryptValue('test');
    expect(result).toEqual('encryptedValuePartencryptedValueFinal');
  });

  it('should set encrypted cookie', () => {
    service.setEncryptedCookie('test', 'value');
    expect(mockCookieService.set).toHaveBeenCalledWith('test', 'encryptedValuePartencryptedValueFinal');
  });

  it('should decrypt value', () => {
    const result = service.decryptValue('test');
    expect(result).toEqual('decryptedValuePartdecryptedValueFinal');
  }); 


});
