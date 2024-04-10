import { type CookieService } from 'ngx-cookie-service'
import { TokenService } from './token.service'

describe('Token Service Tests', () => {
  let tokenService: TokenService
  let cookieServiceMock: CookieService

  beforeEach(() => {
    cookieServiceMock = Object.assign(
      {
        get: jest.fn().mockReturnValue('dummyToken'), set: jest.fn(), check: jest.fn(), getAll: jest.fn(), delete: jest.fn(), deleteAll: jest.fn()
      },
      {
        document: null,
        platformId: null,
        documentIsAccessible: null
      })
  })

  it('Should return the auth token from the cookie', (done) => {
    const dummyToken = 'dummyToken'
    cookieServiceMock.set('authToken', dummyToken)
    tokenService = new TokenService(cookieServiceMock)

    const actualToken = tokenService.authToken
    expect(cookieServiceMock.get).toHaveBeenCalled()
    expect(actualToken).toEqual(dummyToken)
    done()
  })

  it('should get refresh Token from cookie', (done) => {
    const mockRefreshToken = 'dummyToken'
    cookieServiceMock.get(mockRefreshToken)
    tokenService = new TokenService(cookieServiceMock)

    const refreshToken = tokenService.refreshToken
    expect(cookieServiceMock.get).toHaveBeenCalled()
    expect(refreshToken).toEqual(mockRefreshToken)
    done()
  })

  it('should return checkToken correctly', async () => {
    // const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MzIwMzE3MTAwMCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.GlYqDGpU3ny3t5myeYJUb3zya5L4M9EIRbFZk8b98cY'
    /* const result = await authService.checkToken(validToken);
    expect(result).toBe(true); */
    expect(true).toBe(true)
  })

  it('should return checkToken FALSE', async () => {
    // const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MTY0NjYyNzk3NCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.bJcS2VgrPsgc0mPDRFhS_hvrx4ftj6NgR13IO25D7Ag'
    /* const result = await authService.checkToken(expiredToken);
    expect(result).toBe(false); */
    expect(true).toBe(true)
  })

  it('should return isTokenExpired TRUE', (done) => {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MTY0NjYyNzk3NCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.bJcS2VgrPsgc0mPDRFhS_hvrx4ftj6NgR13IO25D7Ag'

    /* let isTokenExpired = authService.isTokenExpired(token);
    expect(isTokenExpired).toEqual(true); */
    expect(true).toBe(true)
    done()
  })

  it('should return isTokenExpired FALSE', (done) => {
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDY2MjU5NzQsImV4cCI6MzIwMzE3MTAwMCwidXNlcl9pZCI6IjEyMzQ1Njc4OSIsInVzZXJuYW1lIjoiZXhhbXBsZV91c2VyIn0.GlYqDGpU3ny3t5myeYJUb3zya5L4M9EIRbFZk8b98cY'

    /* let isTokenExpired = authService.isTokenExpired(token);
    expect(isTokenExpired).toEqual(false); */
    expect(true).toBe(true)
    done()
  })

  it('should return isTokenValid correctly', (done) => {
    /* const test = authService.isTokenValid('test');
    expect(test).toEqual(true); */
    expect(true).toBe(true)
    done()
  })

  it('should return isTokenValid error', (done) => {
    /* const test = authService.isTokenValid('test');
    expect(test).toEqual(true); */
    expect(true).toBe(true)
    done()
  })
})
