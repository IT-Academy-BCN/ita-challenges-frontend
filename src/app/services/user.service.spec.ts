import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { SolutionService } from './solution.service'
// import { User } from '../models/user.model'
import { BehaviorSubject } from 'rxjs'

describe('UserService', () => {
  let userService: UserService
  // let authService: AuthService
  let solutionService: SolutionService

  beforeEach(() => {
    const authServiceMock = {
      login: jest.fn().mockResolvedValue({}),
      logout: jest.fn()
    }

    const solutionServiceMock = {
      solutionSent$: new BehaviorSubject<boolean>(false) // Inizialmente lo stato è "false"
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: SolutionService, useValue: solutionServiceMock }
      ]
    })

    userService = TestBed.inject(UserService)
    // authService = TestBed.inject(AuthService)
    solutionService = TestBed.inject(SolutionService)
  })

  it('should be created', () => {
    expect(userService).toBeTruthy()
  })

  it('should update userSentASolution when solution is sent', () => {
    (solutionService.solutionSent$ as BehaviorSubject<boolean>).next(true)
    userService.monitorSolutionState()
    expect(userService.userSentASolution).toBe(true)
  })

  it('should reset userSentASolution to false on logout', () => {
    (solutionService.solutionSent$ as BehaviorSubject<boolean>).next(true)
    userService.monitorSolutionState()
    expect(userService.userSentASolution).toBe(true)
    userService.logout()
    expect(userService.userSentASolution).toBe(false)
  })
})
