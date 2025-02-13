import { fakeAsync, TestBed, tick } from '@angular/core/testing'
import { UserService } from './user.service'
// import { AuthService } from './auth.service'
import { SolutionService } from './solution.service'
// import { User } from '../models/user.model'
import { BehaviorSubject, of } from 'rxjs'

describe('UserService', () => {
  let userService: UserService
  let solutionService: SolutionService
  // let authServiceMock: any
  let solutionServiceMock: any

  beforeEach(() => {
    // authServiceMock = {
    //   currentUser: { idUser: 'test-user-id' },
    //   login: jest.fn().mockResolvedValue({}),
    //   logout: jest.fn()
    // }

    solutionServiceMock = {
      fetchUserSolution: jest.fn(),
      solutionSent$: new BehaviorSubject<boolean>(false)
    }

    TestBed.configureTestingModule({
      providers: [
        UserService,
        // { provide: AuthService, useValue: authServiceMock },
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
    // userService.logout()
    expect(userService.userSentASolution).toBe(false)
  })

  it('should update userSolutions and userSolutionsSubject with challenge IDs on monitorSolutionState', fakeAsync(() => {
    const mockChallengeIds = ['challenge1', 'challenge2', 'challenge3']
    const mockResponse = { challenges: mockChallengeIds.map(id => ({ uuid_challenge: id })) };

    (solutionService.fetchUserSolution as jest.Mock).mockReturnValue(of(mockResponse))

    // userService.userLoggedIn = true
    userService.monitorSolutionState()
    tick()

    userService.userSolutions$.subscribe((solutions) => {
      expect(solutions).toEqual(mockChallengeIds)
    })
    expect(userService.userSolutions).toEqual(mockChallengeIds)
    expect(solutionService.fetchUserSolution).toHaveBeenCalledWith('test-user-id')
  }))
})
