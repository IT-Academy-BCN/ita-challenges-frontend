import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  type OnInit,
  Output,
  ViewChild,
  inject,
  type SimpleChanges
} from '@angular/core'
import { type ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { ChallengeService } from '../../../../services/challenge.service'
import { type Subscription } from 'rxjs'
import { DataChallenge } from '../../../../models/data-challenge.model'
import { type Challenge } from '../../../../models/challenge.model'
import { NgbModal, type NgbNav } from '@ng-bootstrap/ng-bootstrap'
import { SolutionService } from 'src/app/services/solution.service'
import { SendSolutionModalComponent } from 'src/app/modules/modals/send-solution-modal/send-solution-modal.component'
import { type SolutionResults } from 'src/app/models/solution-results.model'
import { AuthService } from 'src/app/services/auth.service'
import { StarterService } from 'src/app/services/starter.service' 
import { ChallengeTab } from 'src/app/shared/enums/challenge-tab.enum'

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss'],
  providers: [ChallengeService]
})
export class ChallengeInfoComponent
implements OnInit {
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

  @Output() activeIdChange: EventEmitter<ChallengeTab> = new EventEmitter<ChallengeTab>()

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  mockSolutions = [
    {
      uuid_user: '1a2b3c4d-5e6f-6a8b-9c0d-1e2f3a4b5c6d',
      uuid_challenge: 'd43a1a4d-ee8f-432d-8f9c-68eda2547dae',
      uuid_language: '409c9fe8-74de-4db3-81a1-a55280cf92ef',
      solution_text: 'This is the submitted solution'
    },
    {
      uuid_user: '1a2b3c4d-5e6f-6a8b-9c0d-1e2f3a4b5c6d',
      uuid_challenge: 'b5c06903-f27b-4057-8220-ad9d957cdce4',
      uuid_language: '09fabe32-7362-4bfb-ac05-b7bf854c6e0f',
      solution_text: 'This is the submitted solution'
    }
  ]

  async ngOnInit (): Promise<void> {
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
    this.solutionService.solutionSent$.subscribe((sent) => {
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

    this.authService.getUserId().subscribe((userId) => {
      if (userId === null || userId === '') return

      const found = this.mockSolutions.find(
        (sol) => sol.uuid_user === userId && sol.uuid_challenge === this.idChallenge && this.languages.some(lang => lang.id_language === sol.uuid_language)
      )

      if (found !== undefined) {
        this.solutionSent = true
        this.solutionText = found.solution_text
        this.userSolution = { solution_text: found.solution_text }
        this.loadSolutions(this.idChallenge, found.uuid_language)

        this.cdr.detectChanges() // Si necesitas forzar actualización de vista
      }
    })
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

  //Temporary Mocked Implementation
  loadRelatedChallenges(): void {
    const numberOfRelated = 2;

    this.starterService.getAllChallenges().subscribe(response => {
      if (response && response.results) {
        const filteredChallenges = response.results.filter(
          challenge => challenge.id_challenge !== this.idChallenge
        );
        this.relatedChallenges = this.getRandomChallenges(filteredChallenges, numberOfRelated);
        this.relatedChallengesLoaded = true;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper method to randomly select challenges
  // TODO: delete when related challenges endpoint is available 
  private getRandomChallenges(challenges: Challenge[], count: number): Challenge[] {
    // If we don't have enough challenges, return all of them to avoid errors
    if (challenges.length <= count) {
      return challenges;
    }
    
    const shuffled = [...challenges];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
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
}
