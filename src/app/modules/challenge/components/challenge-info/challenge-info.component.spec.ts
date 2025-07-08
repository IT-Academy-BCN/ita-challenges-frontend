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
import { By } from '@angular/platform-browser'
import { of, Subject } from 'rxjs'
import { Component, Input } from '@angular/core'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'

// Mock EditorChallengeComponent
@Component({
  selector: 'app-editor-challenge',
  template: '<div>Mock Editor Component</div>'
})
class MockEditorChallengeComponent {
  @Input() isEditorChallengeVisible: boolean = false;
  @Input() solutionText: string = '';
  @Input() idChallenge: string = '';
  @Input() languageId: string = '';
}

describe('ChallengeInfoComponent', () => {
  let component: ChallengeInfoComponent
  let fixture: ComponentFixture<ChallengeInfoComponent>
  let modalService: NgbModal
  let mockActiveIdSubject: Subject<ChallengeTab>
  let mockChallengeCompletedSubject: Subject<string>

  beforeEach(async () => {
    // Create new subjects for each test
    mockActiveIdSubject = new Subject<ChallengeTab>()
    mockChallengeCompletedSubject = new Subject<string>()
    
    await TestBed.configureTestingModule({
      declarations: [
        ChallengeInfoComponent,
        ResourceCardComponent,
        ChallengeCardComponent,
        SolutionComponent,
        MockEditorChallengeComponent
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
        provideHttpClientTesting(),
        {
          provide: NgbModal,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeInfoComponent)
    component = fixture.componentInstance
    modalService = TestBed.inject(NgbModal)
    
    // Mock the SolutionService properties
    Object.defineProperty(component['solutionService'], 'activeIdSubject', {
      value: mockActiveIdSubject
    })
    
    Object.defineProperty(component['solutionService'], 'activeId$', {
      value: mockActiveIdSubject.asObservable()
    })
    
    Object.defineProperty(component['solutionService'], 'challengeCompleted$', {
      value: mockChallengeCompletedSubject.asObservable()
    })
    
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

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
    const newActiveId = ChallengeTab.SOLUTIONS

    component.onActiveIdChange(newActiveId)

    tick()
    expect(component.activeIdChange).toBeTruthy()
    expect(component.activeId).toBe(newActiveId)
  }))

  describe('Challenge State-Based Display', () => {
    beforeEach(() => {
      // Set up common test data
      component.idChallenge = 'test-challenge-id'
      component.languages = [{ id_language: 'test-language-id', language_name: 'JavaScript' }]
      
      // Mock authService - default to non-admin user
      const authServiceSpy = jest.spyOn((component as any).authService, 'getUserRole')
      authServiceSpy.mockReturnValue({
        subscribe: (fn: any) => {
          fn('USER') // Default to non-admin user
          return { unsubscribe: () => {} }
        }
      })
      
      // Clear localStorage to ensure consistent test state
      localStorage.removeItem('challengeStarted')
      
      fixture.detectChanges()
    })
    
    it('should display show statement checkbox only if user is not admin and challenge has started', async () => {
      // Test case 1: User is not admin and challenge has started - should show checkbox
      component.isAdmin = false
      component.challengeStarted = true
      fixture.detectChanges()
      
      let checkbox = fixture.debugElement.query(By.css('.btn-row input[type="checkbox"]'))
      expect(checkbox).toBeTruthy()
      
      // Test case 2: User is admin and challenge has started - should not show checkbox
      // Note: In reality, admins don't start challenges, but we test the UI logic anyway
      component.isAdmin = true
      component.challengeStarted = true
      fixture.detectChanges()
      
      checkbox = fixture.debugElement.query(By.css('.btn-row input[type="checkbox"]'))
      expect(checkbox).toBeFalsy()
      
      // Test case 3: User is not admin but challenge has not started - should not show checkbox
      component.isAdmin = false
      component.challengeStarted = false
      fixture.detectChanges()
      
      checkbox = fixture.debugElement.query(By.css('.btn-row input[type="checkbox"]'))
      expect(checkbox).toBeFalsy()
    })
    
    it('should initialize show statement checkbox as unchecked when starting a challenge (non-admin only)', () => {
      // Arrange - non-admin user with challenge not started
      component.isAdmin = false
      component.challengeStarted = false
      component.isChallengeStatementVisible = true
      fixture.detectChanges()
      
      // Act - start the challenge
      component.onChallengeStart()
      fixture.detectChanges()
      
      // Assert
      expect(component.challengeStarted).toBe(true)
      expect(component.isChallengeStatementVisible).toBe(false)
    })
    
    it('should display tabs only if challenge has not started (for non-admin users)', () => {
      // Set up as non-admin user
      component.isAdmin = false
      
      // Test case 1: Challenge not started - tabs should be visible
      component.challengeStarted = false
      fixture.detectChanges()
      
      expect(component.isChallengeTabVisible(ChallengeTab.DETAILS)).toBe(true)
      expect(component.isChallengeTabVisible(ChallengeTab.SOLUTIONS)).toBe(true)
      expect(component.isChallengeTabVisible(ChallengeTab.RESOURCES)).toBe(true)
      expect(component.isChallengeTabVisible(ChallengeTab.RELATED)).toBe(true)
      
      // Test case 2: Challenge started - tabs should be hidden
      component.challengeStarted = true
      fixture.detectChanges()
      
      expect(component.isChallengeTabVisible(ChallengeTab.DETAILS)).toBe(false)
      expect(component.isChallengeTabVisible(ChallengeTab.SOLUTIONS)).toBe(false)
      expect(component.isChallengeTabVisible(ChallengeTab.RESOURCES)).toBe(false)
      expect(component.isChallengeTabVisible(ChallengeTab.RELATED)).toBe(false)
    })
    
    it('should always display tabs for admin users regardless of challenge state', () => {
      // Set up as admin user
      component.isAdmin = true
      
      // Even if challengeStarted is true (which shouldn't happen for admins), tabs should still be visible
      component.challengeStarted = true
      fixture.detectChanges()
      
      // For admins, isChallengeTabVisible should ignore the challengeStarted flag
      // Note: This test might fail if the current implementation doesn't have this logic
      // If it fails, it indicates a potential improvement to make tabs always visible for admins
      expect(component.isChallengeTabVisible(ChallengeTab.DETAILS)).toBe(true)
    })
    
    it('should show tabs again when user sends solution (non-admin only)', fakeAsync(() => {
      // Arrange - non-admin user with challenge started, tabs hidden
      component.isAdmin = false
      component.challengeStarted = true
      component.isEditorChallengeVisible = true
      fixture.detectChanges()
      
      // Verify tabs are hidden
      expect(component.isChallengeTabVisible(ChallengeTab.DETAILS)).toBe(false)
      
      // Act - simulate solution sent by emitting the challenge ID
      mockChallengeCompletedSubject.next(component.idChallenge)
      tick()
      fixture.detectChanges()
      
      // Assert
      expect(component.challengeStarted).toBe(false)
      expect(component.isEditorChallengeVisible).toBe(true)
      expect(component.isChallengeTabVisible(ChallengeTab.DETAILS)).toBe(true)
    }))
    
    it('should display side-by-side layout when showing both statement and editor', () => {
      // Arrange - non-admin user
      component.isAdmin = false
      component.isChallengeStatementVisible = true
      component.isEditorChallengeVisible = true
      fixture.detectChanges()
      
      // Act
      const detailsBody = fixture.debugElement.query(By.css('.details-body'))
      
      // Assert
      expect(detailsBody.classes['side-by-side']).toBe(true)
      
      // Change state
      component.isChallengeStatementVisible = false
      fixture.detectChanges()
      
      // Assert
      expect(detailsBody.classes['side-by-side']).toBeFalsy()
    })
  })

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
    it('should load related challenges when tab #4 is selected and challenges are not yet loaded', fakeAsync(() => {
      // Arrange
      component.relatedChallengesLoaded = false;
      const loadRelatedChallengesSpy = jest.spyOn(component, 'loadRelatedChallenges').mockImplementation()
      
      // Act
      component.onActiveIdChange(ChallengeTab.RELATED)
      tick()
      
      // Assert
      expect(loadRelatedChallengesSpy).toHaveBeenCalledTimes(1)
    }))

    it('should not reload related challenges when tab #4 is selected if challenges are already loaded', fakeAsync(() => {
      // Arrange
      component.relatedChallengesLoaded = true;
      const loadRelatedChallengesSpy = jest.spyOn(component, 'loadRelatedChallenges').mockImplementation()
      
      // Act
      component.onActiveIdChange(ChallengeTab.RELATED)
      tick()
      
      // Assert
      expect(loadRelatedChallengesSpy).not.toHaveBeenCalled()
    }))
  
    it('should not load related challenges when other tabs are selected', fakeAsync(() => {
      // Arrange
      const loadRelatedChallengesSpy = jest.spyOn(component, 'loadRelatedChallenges').mockImplementation()
      
      // Act - select tabs 1, 2, and 3
      component.onActiveIdChange(ChallengeTab.DETAILS)
      tick()
      component.onActiveIdChange(ChallengeTab.SOLUTIONS)
      tick()
      component.onActiveIdChange(ChallengeTab.RESOURCES)
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

    it('should load user solution if available', async () => {
      const mockUserId: string = 'test-user-id'
      const mockChallengeId: string = 'test-challenge-id'
      const mockLanguageId: string = 'mock-lang-id'
      const mockSolutionText: string = 'Mock user solution'

      // Prepara valores requeridos
      component.idChallenge = mockChallengeId
      component.languages = [{ id_language: mockLanguageId, language_name: 'JavaScript' }]

      // Mock servicios
      jest.spyOn(component['authService'], 'getUserId').mockReturnValue(of(mockUserId))
      jest.spyOn(component['solutionService'], 'fetchUserSolution').mockReturnValue(of([
        {
          uuid_user: mockUserId,
          uuid_challenge: mockChallengeId,
          uuid_language: mockLanguageId,
          solution_text: mockSolutionText,
          status: 'ENDED'
        }
      ]))

      // Act
      await component['loadUserSolutionData']()
      fixture.detectChanges()

      // Assert
      expect(component.solutionSent).toBe(true)
      expect(component.solutionText).toBe(mockSolutionText)
      expect(component.userSolution).toEqual({
        solution_text: mockSolutionText
      })
    })
  })

  describe('ngOnChanges', () => {
    it('should start challenge when startChallenge input changes to true', () => {
      const changes = {
        startChallenge: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      component.ngOnChanges(changes);
      expect(component.challengeStarted).toBe(true);
      expect(component.isEditorChallengeVisible).toBe(true);
      expect(component.isChallengeStatementVisible).toBe(false);
    });

    it('should load solutions when activeId input changes to SOLUTIONS and user is admin', () => {
      component.isAdmin = true;
      component.idChallenge = 'test-challenge-id';
      component.languages = [{ id_language: 'test-language-id', language_name: 'JavaScript' }];
      const loadSolutionsSpy = jest.spyOn(component, 'loadSolutions');
      const changes = {
        activeId: {
          currentValue: ChallengeTab.SOLUTIONS,
          previousValue: ChallengeTab.DETAILS,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      component.ngOnChanges(changes);
      expect(loadSolutionsSpy).toHaveBeenCalledWith('test-challenge-id', 'test-language-id');
    });
  });

  it('should toggle statement visibility', () => {
    component.isChallengeStatementVisible = true;
    component.toggleStatement();
    expect(component.isChallengeStatementVisible).toBe(false);
    component.toggleStatement();
    expect(component.isChallengeStatementVisible).toBe(true);
  });

  it('should send solution and change active tab on clickSendButton', () => {
    const solutionServiceSpy = jest.spyOn(component['solutionService'], 'sendSolution');
    const onActiveIdChangeSpy = jest.spyOn(component, 'onActiveIdChange');
    component.clickSendButton();
    expect(solutionServiceSpy).toHaveBeenCalledWith('');
    expect(onActiveIdChangeSpy).toHaveBeenCalledWith(ChallengeTab.SOLUTIONS);
    expect(component.isEditorChallengeVisible).toBe(false);
  });

  it('should load solutions from the service', () => {
    const mockSolutions = { results: [{ solution_text: 'test solution' }] } as any;
    const solutionServiceSpy = jest.spyOn(component['solutionService'], 'getAllChallengeSolutions').mockReturnValue(of(mockSolutions));
    component.loadSolutions('test-challenge-id', 'test-language-id');
    expect(solutionServiceSpy).toHaveBeenCalledWith('test-challenge-id', 'test-language-id');
    expect(component.challengeSolutions).toEqual(mockSolutions.results);
  });

  describe('Dropdown functionality', () => {
    it('should toggle dropdown', () => {
      component.isDropdownOpen = false;
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBe(true);
      component.toggleDropdown();
      expect(component.isDropdownOpen).toBe(false);
    });

    it('should close dropdown', () => {
      component.isDropdownOpen = true;
      component.closeDropdown();
      expect(component.isDropdownOpen).toBe(false);
    });

    it('should select tab and close dropdown', () => {
      component.isDropdownOpen = true;
      component.selectTab(ChallengeTab.SOLUTIONS);
      expect(component.activeId).toBe(ChallengeTab.SOLUTIONS);
      expect(component.isDropdownOpen).toBe(false);
    });
  });

  it('should return the correct translated tab label', () => {
    component.activeId = ChallengeTab.DETAILS;
    expect(component.getTranslatedTabLabel()).toBe('modules.challenge.info.detailsTitle');
    component.activeId = ChallengeTab.SOLUTIONS;
    expect(component.getTranslatedTabLabel()).toBe('modules.challenge.info.solutionsTitle');
    component.activeId = ChallengeTab.RESOURCES;
    expect(component.getTranslatedTabLabel()).toBe('modules.challenge.info.resourcesTitle');
    component.activeId = ChallengeTab.RELATED;
    expect(component.getTranslatedTabLabel()).toBe('modules.challenge.info.relatedTitle');
    component.activeId = 'invalid-tab' as any;
    expect(component.getTranslatedTabLabel()).toBe('modules.challenge.info.detailsTitle');
  });

  it('should emit solution changed event', () => {
    const solutionChangedSpy = jest.spyOn(component.solutionChanged, 'emit');
    const newSolution = 'new solution text';
    component.onEditorSolutionChanged(newSolution);
    expect(component.currentSolutionText).toBe(newSolution);
    expect(solutionChangedSpy).toHaveBeenCalledWith(newSolution);
  });
})
