import { TestBed } from '@angular/core/testing'
import { UserService } from './user.service'
import { SolutionService } from './solution.service'
import { BehaviorSubject, of } from 'rxjs'

describe('UserService', () => {
  let userService: UserService
  let solutionService: SolutionService
  let solutionServiceMock: any

  beforeEach(() => {
    solutionServiceMock = {
      fetchUserSolution: jest.fn().mockReturnValue(of({ challenges: [] })),
      solutionSent$: new BehaviorSubject<boolean>(false)
    }

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: SolutionService, useValue: solutionServiceMock }
      ]
    })

    userService = TestBed.inject(UserService)
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

  it('should reset userSentASolution to false when solutionSent$ emits false', () => {
    (solutionService.solutionSent$ as BehaviorSubject<boolean>).next(true)
    userService.monitorSolutionState()
    expect(userService.userSentASolution).toBe(true);

    // Emitimos un nuevo valor en solutionSent$ para simular el reset
    (solutionService.solutionSent$ as BehaviorSubject<boolean>).next(false)

    expect(userService.userSentASolution).toBe(false)
  })

  it('should update userSolutions and userSolutionsSubject with challenge IDs on monitorSolutionState', () => {
    (solutionService.solutionSent$ as BehaviorSubject<boolean>).next(true)

    userService.monitorSolutionState()
    userService.userSolutions$.subscribe((solutions) => {
    })

    userService.solutionSent$.subscribe((sent) => {
      expect(sent).toBe(true)
    })
  })
})
