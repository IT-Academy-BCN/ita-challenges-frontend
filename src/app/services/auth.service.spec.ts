// import { error } from 'console'
// import { Router } from '@angular/router'
// import { addYears } from 'date-fns'
// import { CookieService } from 'ngx-cookie-service'
// import { mock } from 'node:test'
// import { throwError } from 'rxjs'
// import { flushMicrotasks } from '@angular/core/testing'
// import { exec } from 'child_process'
// import exp from 'constants'
// import { CookieEncryptionHelper } from "../helpers/cookie-encryption.helper";

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { AuthService } from './auth.service'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { environment } from 'src/environments/environment'
import { tap } from 'rxjs/operators'
import { User } from '../models/user.model'
import { type TokenService } from './token.service'
import { type Router } from '@angular/router'
import { type CookieService } from 'ngx-cookie-service'
// import { mockLoginResponse, mockRegisterResponse, mockLoginErrorResponse, mockRegisterErrorResponse, mockUnauthorizedErrorResponse } from 'src/mocks/auth/auth.mock'
import mockLoginResponse from '../../mocks/auth/loginResponse.mock.json'
import mockRegisterResponse from '../../mocks/auth/registerResponse.mock.json'
import mockLoginErrorResponse from '../../mocks/auth/loginErrorResponse.json'
import mockRegisterErrorResponse from '../../mocks/auth/registerErrorResponse.mock.json'
import mockUnauthorizedErrorResponse from '../../mocks/auth/unauthorizedErrorResponse.mock.json'
import mockRegisterUser from 'src/mocks/user/mockRegisterUser.mock.json'

describe('AuthService', () => {
  let authService: AuthService
  let cookieServiceMock: { get: jest.Mock, set: jest.Mock, delete: jest.Mock }
  let routerMock: { navigate: jest.Mock }
  let httpClient: HttpClient
  let httpClientMock: HttpTestingController
  let tokenServiceMock: TokenService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient) // TestBed.inject is used to inject into the test suite
    httpClientMock = TestBed.inject(HttpTestingController)

    routerMock = {
      navigate: jest.fn()
    }
    cookieServiceMock = (function () {
      const cookies: Record<string, string | null> = {}
      return {
        get: jest.fn((key: string) => (cookies[key] ?? null)),
        set: jest.fn((key: string, value: string) => {
          cookies[key] = value
        }),
        delete: jest.fn((key: string) => {
          if (Object.prototype.hasOwnProperty.call(cookies, key)) {
            cookies[key] = null
          }
        })
      }
    })()

    Object.defineProperty(window, 'cookies', {
      writable: true,
      value: cookieServiceMock
    })

    authService = new AuthService(httpClient, routerMock as unknown as Router, cookieServiceMock as unknown as CookieService, tokenServiceMock)
  })

  it('should return the current user when user is NOT FOUND in cookies', (done) => {
    const anonymMock = 'anonym'

    cookieServiceMock.get.mockReturnValue(null) // Set cookie service to return null

    const user = authService.currentUser

    expect(user).toBeDefined()
    expect(user.idUser).toBe(anonymMock)

    expect(cookieServiceMock.get).toHaveBeenCalledWith('user')

    done()
  })

  it('should return the current user when user IS FOUND in cookies', (done) => {
    const mockUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail'
    }

    authService.currentUser = mockUser

    const user = authService.currentUser

    expect(user).toBeDefined()
    expect(user).toBe(mockUser)
    expect(cookieServiceMock.get).toHaveBeenCalledWith('user')

    done()
  })

  it('should set current user in cookie and in behavior subject', (done) => {
    const testUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail'
    }

    authService.currentUser = testUser

    expect(cookieServiceMock.set).toHaveBeenCalled()

    authService.user$.subscribe(user => {
      expect(user).toBe(testUser)
    })

    done()
  })

  it('should return userId from cookie', (done) => {
    const mockUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail'
    }

    cookieServiceMock.set('user', JSON.stringify(mockUser))

    const userId = authService.getUserIdFromCookie()

    expect(cookieServiceMock.set).toHaveBeenCalled()
    expect(cookieServiceMock.get).toHaveBeenCalled()
    expect(userId).toEqual(mockUser.idUser)

    done()
  })

  it('should make successful login request', (done) => {
    const testPassword = 'mockUserPassword'
    const testUser = {
      idUser: '',
      dni: 'mockUserDni',
      password: testPassword
    }

    authService.loginRequest(testUser)
      .subscribe({
        next: (res) => {
          expect(res).toBeTruthy()
          expect(res).toEqual(mockLoginResponse)
        }
      })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL))
    expect(req.request.method).toEqual('POST')

    req.flush(mockLoginResponse)
    done()
  })

  it('should make UNsuccessful login request', (done) => {
    const testPassword = 'mockUserPassword'
    const testUser = {
      idUser: '',
      dni: 'mockUserDni',
      password: testPassword
    }

    authService.loginRequest(testUser)
      .subscribe({
        error: (err) => {
          expect(err).toBeTruthy()
          expect(err).toEqual(mockLoginErrorResponse)
        }
      })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL))
    expect(req.request.method).toEqual('POST')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    req.flush(mockLoginErrorResponse)
    done()
  })

  it('should set user cookies and resolve when login succeeds', async () => {
    const testPassword = 'mockUserPassword'
    const mockUser: User = {
      idUser: '',
      dni: 'mockUserDni',
      password: testPassword
    }

    // spyOn function to mock the behavior of the loginRequest function.
    spyOn(authService, 'loginRequest').and.returnValue(of(mockLoginResponse)) // Import 'of' from 'rxjs' if not already imported

    try {
      void authService.login(mockUser).then((returnValue) => {
        expect(returnValue).toBeNull()
        expect(cookieServiceMock.get('authToken')).toEqual('testAuthToken')
        expect(cookieServiceMock.get('refreshToken')).toEqual('testRefreshToken')
        expect(cookieServiceMock.get('user')).toEqual(JSON.stringify(new User('testId')))
      })
    } catch (error) {
      fail('Login failed')
    }
  })

  it('should reject with error message when login fails', async () => {
    const testPassword = 'mockUserPassword'
    const mockUser: User = {
      idUser: '',
      dni: 'mockUserDni',
      password: testPassword
    }

    spyOn(authService, 'loginRequest').and.returnValue(
      of({}).pipe(
        tap(() => {
          const error = new Error('Unauthorized')
          error.name = 'HttpError'
          // Agrega propiedades personalizadas al objeto de error
          Object.assign(error, { status: 401, error: mockUnauthorizedErrorResponse })
          throw error
        })
      )
    )

    try {
      await authService.login(mockUser)
      fail('Login should have failed')
    } catch (error: any) {
      expect(error.error.message).toEqual(mockUnauthorizedErrorResponse.message)
    }
  })

  it('should register request successfully', (done) => {
    authService.registerRequest(mockRegisterUser)
      .subscribe({
        next: (res) => {
          expect(res).toBeTruthy()
          expect(res).toEqual(mockRegisterResponse)
        }
      })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_REGISTER_URL))
    expect(req.request.method).toEqual('POST')

    req.flush(mockRegisterResponse)
    done()
  })

  it('should register request UNsuccessful', (done) => {
    authService.loginRequest(mockRegisterUser)
      .subscribe({
        error: (err) => {
          expect(err).toBeTruthy()
          expect(err).toEqual(mockRegisterResponse)
        }
      })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_LOGIN_URL))
    expect(req.request.method).toEqual('POST')

    req.flush(mockRegisterResponse)
    done()
  })

  it('should show success register modal', (done) => {
    spyOn(authService, 'registerRequest').and.returnValue(of(mockRegisterResponse))
    spyOn(authService, 'modifyUserWithAdmin').and.returnValue(Promise.resolve())

    authService.register(mockRegisterUser).then((returnValue) => {
      expect(returnValue).toBeTruthy()
      expect(returnValue).toEqual(mockRegisterResponse)
      expect(authService.modifyUserWithAdmin).toHaveBeenCalledWith(mockRegisterResponse.id)
      done()
    }).catch((error) => {
      done.fail('Promise should not be rejected: ' + error)
    })
  })

  it('should show UNsuccessly register modal', (done) => {
    spyOn(authService, 'registerRequest').and.returnValue(
      throwError({ status: 401, error: mockRegisterErrorResponse })
    )

    authService.register(mockRegisterUser).then(() => {
      done.fail('Register should have failed')
    }).catch((error) => {
      expect(error).toEqual(mockRegisterErrorResponse.message)
      done()
    })
  })

  it('should logout correctly', (done) => {
    const user = 'user'
    const authToken = 'testAuthToken'
    const refreshToken = 'testRefreshAuthToken'

    cookieServiceMock.set('user', user)
    cookieServiceMock.set('authToken', authToken)
    cookieServiceMock.set('refreshToken', refreshToken)

    authService.logout()
    expect(cookieServiceMock.get).toHaveBeenCalled()

    expect(cookieServiceMock.delete).toHaveBeenCalledWith('user')
    expect(cookieServiceMock.delete).toHaveBeenCalledWith('authToken')
    expect(cookieServiceMock.delete).toHaveBeenCalledWith('refreshToken')

    const currentUser = authService.currentUser
    expect(currentUser.idUser).toBe('anonym')

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login'])
    done()
  })

  it('should getLoggedUserData correctly', fakeAsync(() => {
    const testAuthToken = 'testAuthToken'
    const mockUser = {
      idUser: 'mockIdUser',
      dni: 'mockDni',
      email: 'mockEmail'
    }

    const mockResponse = {
      dni: 'string',
      email: 'user@example.cat',
      role: 'ADMIN'
    }

    cookieServiceMock.set('authToken', testAuthToken)
    authService.currentUser = mockUser

    const user = authService.currentUser
    void authService.getLoggedUserData()

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_POST_USER))
    expect(req.request.method).toEqual('POST')

    req.flush(mockResponse)
    tick()
    expect(authService.currentUser).toEqual({
      idUser: mockUser.idUser,
      dni: mockResponse.dni, // Updated with server response
      email: mockResponse.email // Updated with server response
    })

    expect(user).toBeDefined()
    expect(user).toBe(mockUser)
  }))

  it('should handle error in getLoggedUserData', (done) => {
    spyOn(console, 'error') // spy console.error

    // Simulamos un evento de progreso para indicar un error
    const errorEvent = new ProgressEvent('error', {
      lengthComputable: false,
      loaded: 0,
      total: 0
    })

    authService.getLoggedUserData().catch((error) => {
      expect(console.error).toHaveBeenCalledWith('Error in getLoggedUserData:', jasmine.anything())
      expect(error).toBeDefined()
      done()
    })

    const req = httpClientMock.expectOne(environment.BACKEND_ITA_SSO_BASE_URL.concat(environment.BACKEND_SSO_POST_USER))
    req.error(errorEvent)
  })

  it('should modifyUserWithAdmin correctly', fakeAsync(() => {
    const userAdminMock = {
      idUser: '',
      dni: '12345678Z',
      password: 'passwordMock'
    }

    const mockResAfterLogin = {
      id: 'adminIdMock',
      authToken: 'testAuthToken',
      refreshToken: 'refreshToken'
    }

    cookieServiceMock.set('authToken', mockResAfterLogin.authToken)

    const mockRegisterUserId = 'wig98drksz4se2wpgbnouu4w'

    const mockLoggedUserData = {
      dni: '12345678Z',
      email: 'mock@mock.com',
      role: 'ADMIN'
    }

    const mockResponse = {
      message: 'User has been modified'
    }
    spyOn(authService, 'login').and.returnValue(Promise.resolve(mockResAfterLogin))
    spyOn(authService, 'getLoggedUserData').and.returnValue(Promise.resolve(mockLoggedUserData))

    authService.modifyUserWithAdmin(mockRegisterUserId).then(() => {
      const reqAdmin = httpClientMock.expectOne(environment.ADMIN_USER)
      expect(reqAdmin.request.method).toEqual('GET')
      reqAdmin.flush(mockResAfterLogin)

      expect(mockLoggedUserData.role).toBe('ADMIN')
      expect(authService.login).toHaveBeenCalledWith(userAdminMock)
      expect(authService.getLoggedUserData).toHaveBeenCalled()

      const req = httpClientMock.expectOne(`${environment.BACKEND_ITA_SSO_BASE_URL}${environment.BACKEND_SSO_PATCH_USER}/${mockRegisterUserId}`)
      expect(req.request.method).toEqual('PATCH')
      expect(req.request.headers.get('Content-Type')).toEqual('application/json')
      req.flush(mockResponse)

      expect(authService.logout).toHaveBeenCalled()
    }).catch((error) => {
      fail('Error modifying user: ' + error)
    })

    tick()
  }))

  // TODO - Pending refactor: Insert this tests (with its config) into token.service.spec.ts

  /*  it('should return true if authToken is valid', async () => {
    cookieServiceMock.get.mockReturnValueOnce('validAuthToken');
    authService.checkToken = jest.fn().mockResolvedValueOnce(true);

    const result = await authService.isUserLoggedIn();

    expect(result).toBe(true);
  });

  it('should return true if authToken is invalid but refreshToken is valid', async () => {
    cookieServiceMock.get.mockReturnValueOnce('invalidAuthToken').mockReturnValueOnce('validRefreshToken');
    authService.checkToken = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const result = await authService.isUserLoggedIn();

    expect(result).toBe(true);
  });

  it('should return false if both authToken and refreshToken are invalid', async () => {
    cookieServiceMock.get.mockReturnValueOnce('invalidAuthToken').mockReturnValueOnce('invalidRefreshToken');
    authService.checkToken = jest.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(false);

    const result = await authService.isUserLoggedIn();

    expect(result).toBe(false);
  }); */

  it('should return true if authToken is present', () => {
    cookieServiceMock.get.mockImplementation((key: string) => {
      if (key === 'authToken') {
        return 'some token'
      }
      return null
    })

    expect(authService.isUserLoggedIn()).toBe(true)
  })

  it('should return true if refreshToken is present and authToken is not', () => {
    cookieServiceMock.get.mockImplementation((key: string) => {
      if (key === 'refreshToken') {
        return 'some token'
      }
      return null
    })

    expect(authService.isUserLoggedIn()).toBe(true)
  })

  it('should return false if neither authToken nor refreshToken are present', () => {
    cookieServiceMock.get.mockImplementation(() => null)

    expect(authService.isUserLoggedIn()).toBe(false)
  })
})
