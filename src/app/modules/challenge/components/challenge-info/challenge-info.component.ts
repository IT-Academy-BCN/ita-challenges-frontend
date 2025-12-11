import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
  ViewChild,
  inject,
  type OnDestroy,
  type SimpleChanges
} from '@angular/core'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { firstValueFrom, Subject, takeUntil, type Subscription } from 'rxjs'
import { DataChallenge } from '../../../../models/data-challenge.model'
import { type Challenge } from '../../../../models/challenge.model'
import { NgbModal, type NgbNav } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'
import { SendSolutionModalComponent } from 'src/app/modules/modals/send-solution-modal/send-solution-modal.component'
import { type SolutionResults } from 'src/app/models/solution-results.model'
import { AuthService } from 'src/app/services/auth.service'
import { StarterService } from 'src/app/services/starter.service' 
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss']
})
export class ChallengeInfoComponent
implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isChallengeStatementVisible = true
  solutionSent: boolean = false
  isUserSolution: boolean = true
  resources: string = ''
  params$!: Subscription
  challengeSubs$!: Subscription
  challengeSolutions: SolutionResults[] = []
  solutionText: string = "" 
  userSolution: { solution_text: string } | null = null;
  idLanguageJava = '660e1b18-0c0a-4262-a28a-85de9df6ac5f'
  isDropdownOpen: boolean = false
  isAdmin:boolean = false;
  relatedChallenges: any[] = [];
  relatedChallengesLoaded = false;
  challengeTab = ChallengeTab;
  
  

  challengeStarted: boolean = false

  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly authService = inject(AuthService)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly starterService = inject(StarterService) 
   private readonly challengeService=inject (ChallengeService)
  public currentSolutionText: string = '';


  @ViewChild('nav') nav!: NgbNav

  @Input() detail!: ChallengeDetails
  @Input() solutions: string[] = []
  @Input() description!: string
  @Input() popularity!: number
  @Input() languages: Language[] = []
  @Input() activeId: ChallengeTab = ChallengeTab.DETAILS
  @Input() idChallenge: string = ''

  @Input() isEditorChallengeVisible: boolean = false
  @Input() startChallenge: boolean = false
  @Output() solutionChanged = new EventEmitter<string>();
  @Input() languageId: string = '';
  @Input() initialSolutionText: string = '';
  @Output() solutionChange = new EventEmitter<string>();



  @Output() activeIdChange: EventEmitter<ChallengeTab> = new EventEmitter<ChallengeTab>()

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  ngOnInit (): void {
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.authService.getUserRole().subscribe(role => {
      this.isAdmin = role === 'ADMIN'
    })

    this.solutionService.solutionText$.subscribe((solutionText: string) => {
      this.solutionText = solutionText;
      if (solutionText) {
        this.userSolution = { solution_text: solutionText };
        this.solutionSent = true;
        this.cdr.detectChanges(); 
      }
    });


    this.solutionService.activeIdSubject.next(ChallengeTab.DETAILS)

    this.solutionSent = this.solutions.includes(this.idChallenge)
    
    this.solutionService.solutionSent$.pipe(
  distinctUntilChanged() 
).subscribe((sent) => {
  console.log('solutionSent$ (filtered):', sent);
  
  this.solutionSent = sent;
  if (sent) {
    this.loadSolutions(this.idChallenge, this.languages[0].id_language);
  }
  this.cdr.detectChanges();
});

    this.solutionService.activeId$.subscribe((newActiveId) => {
      this.onActiveIdChange(newActiveId)
    })    
    this.solutionService.challengeCompleted$.subscribe(challengeId => {
      if (challengeId === this.idChallenge) {
        this.challengeStarted = false;
        this.isEditorChallengeVisible = true;
        this.cdr.detectChanges();
      }
    });

    // Check if challenge is already started from localStorage
    const savedChallenge = JSON.parse(localStorage.getItem('challengeStarted') ?? '{}') as { id?: string, started?: boolean }
    if (savedChallenge.id === this.idChallenge && savedChallenge?.started === true) {
      this.challengeStarted = true;
      this.isEditorChallengeVisible = true;
      this.isChallengeStatementVisible = false;
    }

    this.authService.getUserId().subscribe(userId => {
      if (userId != null) {
        void this.loadUserSolutionData()
      }
    })
  }

  private async loadUserSolutionData (): Promise<void> {
    const userId = await firstValueFrom(this.authService.getUserId())
    if (userId === null || userId === '') return

    const response = await firstValueFrom(this.solutionService.fetchUserSolution())

    const match = response.find((solution: any) =>
      solution.uuid_user === userId &&
      solution.uuid_challenge === this.idChallenge &&
      this.languages.some(lang => lang.id_language === solution.uuid_language)
    );

    if (match !== undefined && match !== null) {
      this.solutionSent = true
      this.solutionText = match.solution_text
      this.userSolution = { solution_text: match.solution_text }
      this.loadSolutions(this.idChallenge, String(match.uuid_language))
      this.cdr.detectChanges()
    }
  }

  ngOnChanges (changes: SimpleChanges): void {
    
    if (changes['startChallenge']?.currentValue === true) {
      this.challengeStarted = true;
      this.isEditorChallengeVisible = true;
      this.isChallengeStatementVisible = false;
    }

    if (changes['activeId']?.currentValue === ChallengeTab.SOLUTIONS) {
      const idLanguage = this.languages[0].id_language;
      if (this.isAdmin && this.idChallenge && idLanguage) {
        this.loadSolutions(this.idChallenge, idLanguage);
      }
    }
  }

  onChallengeStart (): void {
    this.challengeStarted = true
    this.isEditorChallengeVisible = true
    this.isChallengeStatementVisible = false;
  }

  toggleStatement (): void {
    this.isChallengeStatementVisible = !this.isChallengeStatementVisible
  }

  onActiveIdChange (newActiveId: ChallengeTab): void {
    this.activeId = newActiveId
    this.activeIdChange.emit(this.activeId)
    
    if (newActiveId === ChallengeTab.RELATED && !this.relatedChallengesLoaded) {
      this.loadRelatedChallenges();
    }
  }

  openSendSolutionModal (): void {
    this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  clickSendButton (): void {
    this.solutionService.sendSolution('') 
    this.onActiveIdChange(ChallengeTab.SOLUTIONS)
    this.isEditorChallengeVisible = false
  }

  loadSolutions (idChallenge: string, idLanguage: string): void {
    this.solutionService
      .getAllChallengeSolutions(idChallenge, idLanguage)
      .subscribe((data) => {
        if (data.results.length > 0) {
          this.challengeSolutions = data.results
        } 
      })
  }

  toggleDropdown (): void {
    this.isDropdownOpen = !this.isDropdownOpen
    if (this.isDropdownOpen) {
      document.addEventListener('click', this.handleOutsideClick)
    } else {
      document.removeEventListener('click', this.handleOutsideClick)
    }
  }

  handleOutsideClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement
    const dropdownElement: Element | null = document.querySelector('.dropdown-menu-mobile')
    if (dropdownElement !== null && !dropdownElement.contains(target)) {
      this.closeDropdown()
    }
  }

  closeDropdown (): void {
    this.isDropdownOpen = false
    document.removeEventListener('click', this.handleOutsideClick)
  }

  selectTab (id: ChallengeTab): void {
    this.activeId = id
    this.isDropdownOpen = false 
  }

  getTranslatedTabLabel (): string {
    switch (this.activeId) {
      case ChallengeTab.DETAILS:
        return 'modules.challenge.info.detailsTitle'
      case ChallengeTab.SOLUTIONS:
        return 'modules.challenge.info.solutionsTitle'
      case ChallengeTab.RESOURCES:
        return 'modules.challenge.info.resourcesTitle'
      case ChallengeTab.RELATED:
        return 'modules.challenge.info.relatedTitle'
      default:
        return 'modules.challenge.info.detailsTitle'
    }
  }


  loadRelatedChallenges(): void {
    this.relatedChallengesLoaded = false;

  this.challengeService.getRelatedChallenges(this.idChallenge)
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (related) => {
      this.relatedChallenges = related;
      this.relatedChallengesLoaded = true;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error loading related challenges:', err);
      this.relatedChallenges = [];
      this.relatedChallengesLoaded = true;
      this.cdr.detectChanges();
    }
  });
  }

 
  isChallengeTabVisible(tabId: ChallengeTab): boolean {
    if (this.isAdmin) {
      return true;
    }
    
    if (this.challengeStarted) {
      return false;
    }    
    
    // Default: all tabs are visible when challenge hasn't started
    return true;
  }
  onEditorSolutionChanged(newText: string): void {
  this.currentSolutionText = newText;
  this.solutionChanged.emit(newText); 
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

}
