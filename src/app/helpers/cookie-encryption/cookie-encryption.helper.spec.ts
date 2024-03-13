import { TestBed } from '@angular/core/testing';
import { CookieEncryptionService } from './cookie-encryption.helper';
import { CookieService } from 'ngx-cookie-service';
import { RegisterModalComponent } from 'src/app/modules/modals/register-modal/register-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as crypto from 'crypto-browserify';
import { ItinerariesService } from 'src/app/services/itineraries.service';

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

/**
 * Pruebas para CookieEncryptionService.
 */
describe('CookieEncryptionService', () => {
  let service: CookieEncryptionService;
  let mockCookieService: any;

  beforeEach(async() => {
    /**
      * Crea un objeto con funciones simuladas para cada método en CookieService
      */
    mockCookieService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ RegisterModalComponent, ItinerariesService ],
      providers: [
        { provide: CookieService, useValue: mockCookieService },
        CookieEncryptionService,
      ],
    })
    .compileComponents();
  
    /**
      * Crea una nueva instancia del servicio con el servicio de cookies simulado
      */
    //service = new CookieEncryptionService(mockCookieService);
    service = TestBed.inject(CookieEncryptionService);

  });

  /**
   * Prueba que el servicio se crea correctamente.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  /**
   * Prueba que el servicio encripta correctamente un valor.
   */
  it('should encrypt value', () => {
    const result = service.encryptValue('test');
    expect(result).toEqual('encryptedValuePartencryptedValueFinal');
  });

  /**
   * Prueba que el servicio establece correctamente una cookie encriptada.
   */
  it('should set encrypted cookie', () => {
    service.setEncryptedCookie('test', 'value');
    expect(mockCookieService.set).toHaveBeenCalledWith('test', 'encryptedValuePartencryptedValueFinal');
  });

  /**
   * Prueba que el servicio desencripta correctamente un valor.
   */
  it('should decrypt value', () => {
    const result = service.decryptValue('test');
    expect(result).toEqual('decryptedValuePartdecryptedValueFinal');
  }); 


});
