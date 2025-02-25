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
import { RelatedService } from '../../../../services/related.service'
import { type SolutionResults } from 'src/app/models/solution-results.model'

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
  relatedChallengesData!: DataChallenge
  relatedListOfChallenges: Challenge[] = []
  challengeSubs$!: Subscription
  challengeSolutions: SolutionResults[] = []
  idLanguageJava = '660e1b18-0c0a-4262-a28a-85de9df6ac5f'
  isDropdownOpen: boolean = false

  challengeStarted: boolean = false
  // showEditor: boolean = false

  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly relatedService = inject(RelatedService)
  private readonly cdr = inject(ChangeDetectorRef)

  @ViewChild('nav') nav!: NgbNav

  @Input() detail!: ChallengeDetails
  @Input() solutions: string[] = []
  @Input() description!: string
  @Input() examples: Example[] = []
  @Input() notes!: string
  @Input() popularity!: number
  @Input() languages: Language[] = []
  @Input() activeId: number = 1
  @Input() idChallenge: string = ''

  @Input() showEditor: boolean = false
  @Input() startChallenge: boolean = false

  @Output() activeIdChange: EventEmitter<number> = new EventEmitter<number>()

  solutionsDummy = [{ solutionName: 'dummy1' }, { solutionName: 'dummy2' }]

  async ngOnInit (): Promise<void> {
    this.solutionService.activeIdSubject.next(1)
    this.solutionSent = this.solutions.includes(this.idChallenge)
    console.log('ChallengeInfoComponent: solutionSent updated to', this.solutionSent)
    this.solutionService.activeId$.subscribe((newActiveId) => {
      this.onActiveIdChange(newActiveId)
    })

    this.loadRelatedChallenges(this.idChallenge)
    this.loadSolutions(this.idChallenge, this.idLanguageJava)
  }

  ngOnChanges (changes: SimpleChanges): void {
    if (changes['startChallenge']?.currentValue === true) {
      this.showEditor = true
      this.onChallengeStart()
    }
  }

  onChallengeStart (): void {
    this.challengeStarted = true
    this.showEditor = true
  }

  toggleStatement (): void {
    this.showStatement = !this.showStatement
  }

  loadRelatedChallenges (id: string): void {
    this.challengeSubs$ = this.relatedService
      .getRelatedChallenges(id)
      .subscribe((data) => {
        this.relatedChallengesData = new DataChallenge(data)
        this.relatedListOfChallenges = this.relatedChallengesData.challenges
      })
  }

  onActiveIdChange (newActiveId: number): void {
    this.activeId = newActiveId
    this.activeIdChange.emit(this.activeId) // Emite el nuevo activeId
  }

  openSendSolutionModal (): void {
    this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  clickSendButton (): void {
    this.solutionService.sendSolution('') // Lógica para enviar la solución al backend si es necesario
    this.onActiveIdChange(2)
  }

  loadSolutions (idChallenge: string, idLanguage: string): void {
    this.solutionService
      .getAllChallengeSolutions(idChallenge, idLanguage)
      .subscribe((data) => {
        console.log('Raw data from API:', data)
        if (data.results.length > 0) {
          this.challengeSolutions = data.results
          console.log('Challenge Solutions Loaded:', this.challengeSolutions)
        } else {
          console.log('No solutions found or data format issue')
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
    this.isDropdownOpen = false // Cierra el menú desplegable si es necesario
  }

  getTranslatedTabLabel (): string {
    switch (this.activeId) {
      case 1:
        return 'modules.challenge.info.detailsTitle'
      case 2:
        return 'modules.challenge.info.solutionsTitle'
      case 3:
        return 'modules.challenge.info.resourcesTitle'
      case 4:
        return 'modules.challenge.info.relatedTitle'
      default:
        return 'modules.challenge.info.detailsTitle'
    }
  }
}
