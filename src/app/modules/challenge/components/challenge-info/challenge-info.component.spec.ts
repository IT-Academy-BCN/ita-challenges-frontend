import { type ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ChallengeInfoComponent } from './challenge-info.component'
import { RouterTestingModule } from '@angular/router/testing'
import { I18nModule } from '../../../../../assets/i18n/i18n.module'
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule } from '@angular/forms'
import { SolutionComponent } from '../../../../shared/components/solution/solution.component'
import { ResourceCardComponent } from '../../../../shared/components/resource-card/resource-card.component'
import { ChallengeCardComponent } from '../../../../shared/components/challenge-card/challenge-card.component'
import { SendSolutionModalComponent } from 'src/app/modules/modals/send-solution-modal/send-solution-modal.component'
import { DynamicTranslatePipe } from 'src/app/pipes/dynamic-translate.pipe'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent
  let fixture: ComponentFixture<ChallengeInfoComponent>
  let modalService: NgbModal

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChallengeInfoComponent,
        ResourceCardComponent,
        ChallengeCardComponent,
        SolutionComponent
        // RestrictedModalComponent
      ],
      imports: [
        RouterTestingModule,
        I18nModule,
        FormsModule,
        NgbNavModule,
        DynamicTranslatePipe
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeInfoComponent)
    component = fixture.componentInstance
    modalService = TestBed.inject(NgbModal)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('ngOnInit', () => {
    it('should initialize component properties correctly', async () => {
      // Arrange
      const authServiceSpy = jest.spyOn((component as any).authService, 'getUserRole')
      authServiceSpy.mockReturnValue({
        subscribe: (fn: any) => {
          fn('USER') // Not ADMIN
          return { unsubscribe: () => {} }
        }
      })
      
      // Act
      await component.ngOnInit()
      
      // Assert
      expect(authServiceSpy).toHaveBeenCalledTimes(1)
      expect(component.isAdmin).toBe(false)
    })
  })

  it('should open send solution modal', () => {
    jest.spyOn(modalService, 'open').mockImplementation()
    component.openSendSolutionModal()
    expect(modalService.open).toHaveBeenCalledWith(SendSolutionModalComponent, { centered: true, size: 'lg' })
  })

  it('should open restricted modal if user is not logged in', () => {
    jest.spyOn(modalService, 'open').mockImplementation()
    component.clickSendButton()
    // expect(modalService.open).toHaveBeenCalledWith(RestrictedModalComponent, { centered: true, size: 'lg' })
  })

  it('should onActiveIdChange correctly', fakeAsync(() => {
    const newActiveId = 2

    component.onActiveIdChange(newActiveId)

    tick()
    expect(component.activeIdChange).toBeTruthy()
    expect(component.activeId).toBe(newActiveId)
  }))


  describe('Related Challenges Feature', () => {
    let component: ChallengeInfoComponent
    let fixture: ComponentFixture<ChallengeInfoComponent>
    let starterServiceMock: any
  
    beforeEach(() => {
      fixture = TestBed.createComponent(ChallengeInfoComponent)
      component = fixture.componentInstance
      starterServiceMock = (component as any).starterService
      fixture.detectChanges()
    })
  
  
    // The following tests check if related challenges are loaded when the correct tab is selected.
    // These tests should remain the same when implementing the real related challenges endpoint.
    it('should load related challenges when tab #4 is selected', fakeAsync(() => {
      // Arrange
      const loadRelatedChallengesSpy = jest.spyOn(component, 'loadRelatedChallenges').mockImplementation()
      
      // Act
      component.onActiveIdChange(4)
      tick()
      
      // Assert
      expect(loadRelatedChallengesSpy).toHaveBeenCalledTimes(1)
    }))
  
    it('should not load related challenges when other tabs are selected', fakeAsync(() => {
      // Arrange
      const loadRelatedChallengesSpy = jest.spyOn(component, 'loadRelatedChallenges').mockImplementation()
      
      // Act - select tabs 1, 2, and 3
      component.onActiveIdChange(1)
      tick()
      component.onActiveIdChange(2)
      tick()
      component.onActiveIdChange(3)
      tick()
      
      // Assert
      expect(loadRelatedChallengesSpy).not.toHaveBeenCalled()
    }))
  
    
    // The following test will need to be updated when implementing the real related challenges endpoint.
    // Instead of mocking StarterService.getAllChallenges and filtering locally,
    // you'll need to mock the new endpoint that directly returns related challenges.
    it('should filter out current challenge from related challenges', () => {
      // Arrange
      const mockChallenges = [
        { id_challenge: '1', challenge_title: 'Challenge 1' },
        { id_challenge: '2', challenge_title: 'Challenge 2' },
        { id_challenge: '3', challenge_title: 'Challenge 3' }
      ] as any[]
      
      component.idChallenge = '2' // Current challenge ID
      
      // Mock the StarterService.getAllChallenges method
      const getAllChallengesSpy = jest.spyOn(starterServiceMock, 'getAllChallenges')
      getAllChallengesSpy.mockReturnValue({
        subscribe: (fn: any) => {
          fn({ results: mockChallenges })
          return { unsubscribe: () => {} }
        }
      })
      
      // Mock the getRandomChallenges method
      const getRandomChallengesSpy = jest.spyOn(component as any, 'getRandomChallenges')
      getRandomChallengesSpy.mockReturnValue([
        { id_challenge: '1', challenge_title: 'Challenge 1' },
        { id_challenge: '3', challenge_title: 'Challenge 3' }
      ])
      
      // Act
      component.loadRelatedChallenges()
      
      // Assert
      expect(getAllChallengesSpy).toHaveBeenCalledTimes(1)
      expect(getRandomChallengesSpy).toHaveBeenCalledTimes(1)
      
      // Verify filtered challenges were passed to getRandomChallenges
      const filteredChallenges = mockChallenges.filter(c => c.id_challenge !== '2')
      expect(getRandomChallengesSpy).toHaveBeenCalledWith(
        filteredChallenges,
        expect.any(Number)
      )
    })
  
    // The following tests for getRandomChallenges will be obsolete when implementing
    // the real related challenges endpoint, as this method will be removed.
    // These tests should be replaced with tests for the new endpoint integration.
    it('should return all challenges when count is greater than available challenges', () => {
      // Arrange
      const mockChallenges = [
        { id_challenge: '1', challenge_title: 'Challenge 1' },
        { id_challenge: '2', challenge_title: 'Challenge 2' }
      ] as any[]
      
      // Act - Call the private method directly
      const result = (component as any).getRandomChallenges(mockChallenges, 3)
      
      // Assert
      expect(result.length).toBe(2)
      expect(result).toEqual(mockChallenges)
    })
    
    it('should select random challenges correctly', () => {
      // Arrange
      const mockChallenges = [
        { id_challenge: '1', challenge_title: 'Challenge 1' },
        { id_challenge: '2', challenge_title: 'Challenge 2' },
        { id_challenge: '3', challenge_title: 'Challenge 3' },
        { id_challenge: '4', challenge_title: 'Challenge 4' },
        { id_challenge: '5', challenge_title: 'Challenge 5' }
      ] as any[]
      
      // Act
      const result = (component as any).getRandomChallenges(mockChallenges, 3)
      
      // Assert
      expect(result.length).toBe(3)
      // Each result should be one of the original challenges
      result.forEach((challenge: any) => {
        expect(mockChallenges).toContainEqual(challenge)
      })
      
      // Verify we're getting unique challenges (no duplicates)
      const uniqueIds = new Set(result.map((c: any) => c.id_challenge))
      expect(uniqueIds.size).toBe(result.length)
    })
  })
})
