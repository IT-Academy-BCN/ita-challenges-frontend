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
  showStatement = true
  solutionSent: boolean = false
  isUserSolution: boolean = true
  resources: string = ''
  params$!: Subscription
  challengeSubs$!: Subscription
  challengeSolutions: SolutionResults[] = []
  idLanguageJava = '660e1b18-0c0a-4262-a28a-85de9df6ac5f'
  isDropdownOpen: boolean = false
  isAdmin:boolean = false;
  relatedChallenges: any[] = [];
  relatedChallengesLoaded = false;
  challengeTab = ChallengeTab;

  challengeStarted: boolean = false
  // showEditor: boolean = false

  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly authService = inject(AuthService)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly starterService = inject(StarterService) 

  @ViewChild('nav') nav!: NgbNav

  @Input() detail!: ChallengeDetails
  @Input() solutions: string[] = []
  @Input() description!: string
  @Input() examples: Example[] = []
  @Input() notes!: string
  @Input() popularity!: number
  @Input() languages: Language[] = []
  @Input() activeId: number = ChallengeTab.DETAILS
  @Input() idChallenge: string = ''

  @Input() showEditor: boolean = false
  @Input() startChallenge: boolean = false

  @Output() activeIdChange: EventEmitter<number> = new EventEmitter<number>()

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  async ngOnInit (): Promise<void> {
    this.authService.getUserRole().subscribe(role => {
      this.isAdmin = role === 'ADMIN'
    })

    this.solutionService.activeIdSubject.next(ChallengeTab.DETAILS)

    this.solutionSent = this.solutions.includes(this.idChallenge)
    this.solutionService.activeId$.subscribe((newActiveId) => {
      this.onActiveIdChange(newActiveId)
    })    
    this.solutionService.challengeCompleted$.subscribe(challengeId => {
      if (challengeId === this.idChallenge) {
        this.challengeStarted = false;
        this.showEditor = true;
        this.cdr.detectChanges();
      }
    });

    // Check if challenge is already started from localStorage
    const savedChallenge = JSON.parse(localStorage.getItem('challengeStarted') ?? '{}') as { id?: string, started?: boolean }
    if (savedChallenge.id === this.idChallenge && savedChallenge?.started === true) {
      this.challengeStarted = true;
      this.showEditor = true;
      this.showStatement = false;
    }
  }

  ngOnChanges (changes: SimpleChanges): void {
    
    if (changes['startChallenge']?.currentValue === true) {
      this.challengeStarted = true;
      this.showEditor = true;
      this.showStatement = false;
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
    this.showEditor = true
    this.showStatement = false;
  }

  toggleStatement (): void {
    this.showStatement = !this.showStatement
  }

  onActiveIdChange (newActiveId: number): void {
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
    this.showEditor = false
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

  selectTab (id: number): void {
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
    const numberOfRelated = Math.floor(Math.random() * 3) + 2;

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

  isTabVisible(tabId: number): boolean {
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
