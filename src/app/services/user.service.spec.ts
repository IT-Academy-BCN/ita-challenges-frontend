import { TestBed } from '@angular/core/testing'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { User } from '../models/user.model'

describe('UserService', () => {
  let userService: UserService
  let authService: AuthService

  beforeEach(() => {
    const authServiceMock = {
      login: jest.fn().mockResolvedValue({}),
      logout: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    })

    userService = TestBed.inject(UserService)
    authService = TestBed.inject(AuthService)
  })

  it('should be created', () => {
    expect(userService).toBeTruthy()
  })

  it('should login user and set userLoggedIn to true', async () => {
    const user: User = new User('1', '12345678', 'password', 'test@example.com', 'password')
    await userService.login(user)
    expect(authService.login).toHaveBeenCalledWith(user)
    expect(userService.userLoggedIn).toBe(true)
  })

  it('should logout user and set userLoggedIn to false', () => {
    userService.logout()
    expect(authService.logout).toHaveBeenCalled()
    expect(userService.userLoggedIn).toBe(false)
  })
})
