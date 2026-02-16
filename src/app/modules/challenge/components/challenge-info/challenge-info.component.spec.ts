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
import { ChallengeService } from 'src/app/services/challenge.service'
import { By } from '@angular/platform-browser'
import { of, Subject, throwError } from 'rxjs'
import { Component, Input } from '@angular/core'
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { SolutionStatus } from 'src/app/models/user-solution-status.enum'

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
  let mockSolutionSentSubject: Subject<boolean>

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

    // Provide solutionSent subject to trigger solution-sent logic
    mockSolutionSentSubject = new Subject<boolean>()
    Object.defineProperty(component['solutionService'], 'solutionSent$', {
      value: mockSolutionSentSubject.asObservable()
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
    
  
    beforeEach(() => {
      fixture = TestBed.createComponent(ChallengeInfoComponent)
      component = fixture.componentInstance
      
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

  it('should react to solutionSent$ emission and load solutions and user data', () => {
    // Spy on methods called when solution is sent
    const loadSolutionsSpy = jest.spyOn(component, 'loadSolutions').mockImplementation()
    const loadUserSolutionSpy = jest.spyOn(component as any, 'loadUserSolutionData')

    // set necessary props
    component.idChallenge = 'abc'
    component.languages = [{ id_language: 'lang1', language_name: 'JS' }]

    // Emit true to simulate solution sent
    mockSolutionSentSubject.next(true)

    expect(loadSolutionsSpy).toHaveBeenCalledWith('abc', 'lang1')
    expect(loadUserSolutionSpy).toHaveBeenCalled()
  })

  it('should not call fetchUserSolution when userId is empty in loadUserSolutionData', async () => {
    jest.spyOn((component as any).authService, 'getUserId').mockReturnValue(of(''))
    const fetchSpy = jest.spyOn(component['solutionService'], 'fetchUserSolution')
    component.idChallenge = 'c-empty'
    component.languages = [{ id_language: 'lang1', language_name: 'JS' }]

    await (component as any).loadUserSolutionData()

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('should set userSolution and solutionText when loadUserSolutionData finds a match', async () => {
    jest.spyOn((component as any).authService, 'getUserId').mockReturnValue(of('user-1'))
    const submissions = [
      { uuid_user: 'user-1', uuid_challenge: 'c-1', uuid_language: 'lang1', solution_text: 'found-text' }
    ] as any[]
    jest.spyOn(component['solutionService'], 'fetchUserSolution').mockReturnValue(of(submissions))

    component.idChallenge = 'c-1'
    component.languages = [{ id_language: 'lang1', language_name: 'JS' }]

    await (component as any).loadUserSolutionData()

    expect(component.userSolution).toEqual({ solution_text: 'found-text' })
    expect(component.solutionText).toBe('found-text')
  })

  it('should not load solutions when activeId input changes to SOLUTIONS and user is not admin', () => {
    component.isAdmin = false;
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
    expect(loadSolutionsSpy).not.toHaveBeenCalled();
  });

  it('should not start challenge when startChallenge input is false', () => {
    const changes = {
      startChallenge: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    component.ngOnChanges(changes);
    expect(component.challengeStarted).toBe(false);
  });

  it('should handle outside click to close dropdown', () => {
    component.isDropdownOpen = true;
    component.handleOutsideClick(new MouseEvent('click'));
    expect(component.isDropdownOpen).toBe(false);
  });

 it('should load solutions from user submissions', fakeAsync(() => {
  const mockSubmissions = [
    {
      uuid_challenge: 'test-challenge-id',
      uuid_language: 'test-language-id',
      solution_text: 'test solution',
      uuid_submission: 'sub-1'
    }
  ] as any[];

  const fetchSpy = jest
    .spyOn(component['solutionService'], 'fetchUserSolution')
    .mockReturnValue(of(mockSubmissions));

  component.loadSolutions('test-challenge-id', 'test-language-id');
  tick();

  expect(fetchSpy).toHaveBeenCalled();
  expect(component.challengeSolutions).toEqual([
    {
      id_solution: 'sub-1',
      uuid_language: 'test-language-id',
      uuid_challenge: 'test-challenge-id',
      solution_text: 'test solution'
    }
  ]);
}));

it('should load solutions using id_solution and solution_text when present', fakeAsync(() => {
  const mockSubmissions = [
    {
      uuid_challenge: 'test-challenge-id',
      uuid_language: 'test-language-id',
      id_solution: 'sol-123',
      solution_text: 'text from solution_text'
    }
  ] as any[];

  const fetchSpy = jest
    .spyOn(component['solutionService'], 'fetchUserSolution')
    .mockReturnValue(of(mockSubmissions));

  const detectSpy = jest
    .spyOn((component as any).cdr, 'detectChanges')
    .mockImplementation();

  component.loadSolutions('test-challenge-id', 'test-language-id');
  tick();

  expect(fetchSpy).toHaveBeenCalled();
  expect(component.challengeSolutions).toEqual([
    {
      id_solution: 'sol-123',
      uuid_language: 'test-language-id',
      uuid_challenge: 'test-challenge-id',
      solution_text: 'text from solution_text'
    }
  ]);
  expect(detectSpy).toHaveBeenCalled();
}));

it('should filter non-matching submissions and use fallbacks for mapped fields', fakeAsync(() => {
  const mockSubmissions = [
    
    {
      uuid_challenge: 'other-challenge',
      uuid_language: 'test-language-id',
      id_solution: 'should-be-filtered'
    },
    
    {
      uuid_challenge: 'test-challenge-id',
  uuid_language: 'test-language-id',   
  submission_text: 'text from submission_text'
    }
  ] as any[];

  jest
    .spyOn(component['solutionService'], 'fetchUserSolution')
    .mockReturnValue(of(mockSubmissions));

  component.loadSolutions('test-challenge-id', 'test-language-id');
  tick();

  expect(component.challengeSolutions).toEqual([
    {
      id_solution: '',
      uuid_language: 'test-language-id',
      uuid_challenge: 'test-challenge-id',
      solution_text: 'text from submission_text'
    }
  ]);
}));




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
  describe('Official Solution Visibility', () => {
    it('should return false for shouldShowOfficialSolution when userSolutionStatus is NOT_STARTED', () => {
      component.userSolutionStatus = SolutionStatus.NOT_STARTED
      expect(component.shouldShowOfficialSolution()).toBe(false)
    })

    it('should return false for shouldShowOfficialSolution when userSolutionStatus is IN_PROGRESS', () => {
      component.userSolutionStatus = SolutionStatus.IN_PROGRESS
      expect(component.shouldShowOfficialSolution()).toBe(false)
    })

    it('should return true for shouldShowOfficialSolution when userSolutionStatus is SHOW_SOLUTION', () => {
      component.userSolutionStatus = SolutionStatus.SHOW_SOLUTION
      expect(component.shouldShowOfficialSolution()).toBe(true)
    })

    it('should return true for shouldShowOfficialSolution when userSolutionStatus is ENDED', () => {
      component.userSolutionStatus = SolutionStatus.ENDED
      expect(component.shouldShowOfficialSolution()).toBe(true)
    })

    it('should update solutionSent and solutionText when loading user solution', async () => {
      const mockSolution = {
        uuid_user: 'test-user-id',
        uuid_challenge: 'test-challenge-id',
        uuid_language: 'test-language-id',
        status: SolutionStatus.IN_PROGRESS,
        solution_text: 'test solution'
      }

      jest.spyOn((component as any).solutionService, 'fetchUserSolution').mockReturnValue(of([mockSolution]))
      jest.spyOn((component as any).authService, 'getUserId').mockReturnValue(of('test-user-id'))

      component.idChallenge = 'test-challenge-id'
      component.languages = [{ id_language: 'test-language-id', language_name: 'Java' }]

      await (component as any).loadUserSolutionData()

      expect(component.solutionSent).toBe(true)
      expect(component.solutionText).toBe('test solution')
    })
  })
})

describe('loadRelatedChallenges', () => {
  let component: ChallengeInfoComponent;
  let fixture: ComponentFixture<ChallengeInfoComponent>;
  let challengeServiceMock: any;
  let cdrMock: any;

  beforeEach(async () => {
    challengeServiceMock = {
      getRelatedChallenges: jest.fn().mockReturnValue(of([]))
    };

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
        { provide: ChallengeService, useValue: challengeServiceMock },
        {
          provide: NgbModal,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeInfoComponent);
    component = fixture.componentInstance;
    cdrMock = (component as any).cdr;
    
    cdrMock.detectChanges = jest.fn();
    
    component.idChallenge = 'test-challenge-id';
    
    fixture.detectChanges();
  });

  it('should load related challenges successfully', () => {
    // Arrange
    const mockRelatedChallenges = [
      { id_challenge: '1', title: 'Related Challenge 1' },
      { id_challenge: '2', title: 'Related Challenge 2' }
    ];
    
    challengeServiceMock.getRelatedChallenges.mockReturnValue(
      of(mockRelatedChallenges)
    );
    
    // Act
    component.loadRelatedChallenges();
    
    // Assert
    expect(challengeServiceMock.getRelatedChallenges).toHaveBeenCalledWith('test-challenge-id');
    expect(component.relatedChallenges).toEqual(mockRelatedChallenges);
    expect(component.relatedChallengesLoaded).toBe(true);
    expect(cdrMock.detectChanges).toHaveBeenCalled();
  });

  it('should handle error when loading related challenges', () => {
    // Arrange
    const errorMessage = 'Test error';
    challengeServiceMock.getRelatedChallenges.mockReturnValue(
      throwError(() => new Error(errorMessage))
    );
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Act
    component.loadRelatedChallenges();
    
    // Assert
    expect(challengeServiceMock.getRelatedChallenges).toHaveBeenCalledWith('test-challenge-id');
    expect(component.relatedChallenges).toEqual([]);
    expect(component.relatedChallengesLoaded).toBe(true);
    expect(cdrMock.detectChanges).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error loading related challenges:', expect.any(Error));
    
    // Clean up
    consoleSpy.mockRestore();
  });
});

describe('localStorage challenge started', () => {
  let component: ChallengeInfoComponent;
  let fixture: ComponentFixture<ChallengeInfoComponent>;
  let mockSolutionSentSubject: Subject<boolean>;

  beforeEach(async () => {
    mockSolutionSentSubject = new Subject<boolean>();

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
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeInfoComponent);
    component = fixture.componentInstance;

    Object.defineProperty(component['solutionService'], 'solutionSent$', {
      value: mockSolutionSentSubject.asObservable()
    });

    Object.defineProperty(component['solutionService'], 'activeIdSubject', {
      value: new Subject<ChallengeTab>()
    });

    Object.defineProperty(component['solutionService'], 'activeId$', {
      value: new Subject<ChallengeTab>().asObservable()
    });

    Object.defineProperty(component['solutionService'], 'challengeCompleted$', {
      value: new Subject<string>().asObservable()
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should restore challenge started state from localStorage when challenge matches', () => {
    component.idChallenge = 'test-challenge-123';
    localStorage.setItem('challengeStarted', JSON.stringify({ id: 'test-challenge-123', started: true }));

    component.languages = [{ id_language: 'lang1', language_name: 'JS' }];
    component.solutions = [];

    component.ngOnInit();

    expect(component.challengeStarted).toBe(true);
    expect(component.isEditorChallengeVisible).toBe(true);
    expect(component.isChallengeStatementVisible).toBe(false);
  });

  it('should NOT restore challenge started state from localStorage when challenge ID does not match', () => {
    component.idChallenge = 'test-challenge-different';
    localStorage.setItem('challengeStarted', JSON.stringify({ id: 'test-challenge-123', started: true }));

    component.languages = [{ id_language: 'lang1', language_name: 'JS' }];
    component.solutions = [];

    component.ngOnInit();

    expect(component.challengeStarted).toBe(false);
    expect(component.isEditorChallengeVisible).toBe(false);
    expect(component.isChallengeStatementVisible).toBe(true);
  });

  it('should NOT restore challenge started state when localStorage has no data', () => {
    component.idChallenge = 'test-challenge-123';
    localStorage.clear();

    component.languages = [{ id_language: 'lang1', language_name: 'JS' }];
    component.solutions = [];

    component.ngOnInit();

    expect(component.challengeStarted).toBe(false);
  });
});
