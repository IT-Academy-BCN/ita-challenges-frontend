import {
  ChangeDetectorRef, Component, EventEmitter, Input, type OnInit,
  Output, inject, type SimpleChanges
} from '@angular/core'

import { ActivatedRoute, Router } from '@angular/router'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { SolutionService } from 'src/app/services/solution.service'
import { RelatedService } from '../../../../services/related.service'
import { UserService } from 'src/app/services/user.service'
import { ChallengeDetails } from 'src/app/models/challenge-details.model'
import { type Example } from 'src/app/models/challenge-example.model'
import { type Language } from 'src/app/models/language.model'
import { type SolutionResults } from 'src/app/models/solution-results.model'

@Component({
  selector: 'app-challenge-editor',
  templateUrl: './challenge-editor.component.html',
  styleUrl: './challenge-editor.component.css'
})
export class ChallengeEditorComponent implements OnInit {
  isEditorRoute: boolean = false

  constructor (private readonly Router: Router, private readonly activatedRoute: ActivatedRoute) {}

  showStatement = true
  solutionSent: boolean = false
  isUserSolution: boolean = true
  resources: string = ''
  idLanguageJava = '660e1b18-0c0a-4262-a28a-85de9df6ac5f'
  isDropdownOpen: boolean = false
  showEditor: boolean = false
  isEditorReduced: boolean = false
  challengeSolutions: SolutionResults[] = []

  private readonly solutionService = inject(SolutionService)
  private readonly modalService = inject(NgbModal)
  private readonly relatedService = inject(RelatedService)
  private readonly userService = inject(UserService)
  private readonly cdr = inject(ChangeDetectorRef)

  @Input() detail!: ChallengeDetails
  @Input() solutions: any = []
  @Input() description!: string
  @Input() examples: Example[] = []
  @Input() notes!: string
  @Input() languages: Language[] = []
  @Input() activeId: number = 1
  @Input() idChallenge: string = ''
  @Input() startChallenge: boolean = false

  @Output() activeIdChange: EventEmitter<number> = new EventEmitter<number>()

  ngOnInit (): void {
    // Verificamos si la ruta actual corresponde a la ruta del editor
    this.activatedRoute.url.subscribe(url => {
      this.isEditorRoute = url[0]?.path === 'editor' // Aquí verificamos si estamos en la ruta 'editor'
    })
  }

  async onStartChallenge (): Promise<void> {
    if (this.idChallenge && this.idChallenge !== '') {
      try {
        await this.router.navigate([`ita-challenge/challenges/${this.idChallenge}/editor`])
        console.log('Navegación exitosa')
      } catch (err) {
        console.error('Error en la navegación:', err)
      }
    }
  }
}

// ngOnChanges (changes: SimpleChanges): void {
//   if (changes['startChallenge']?.currentValue !== undefined && changes['startChallenge']?.currentValue !== null) {
//     console.log('startChallenge changed:', changes['startChallenge'].currentValue)
//     this.startingChallenge()
//   }
// }

// onSaveChallenge (): void {
//   // Guardar el ID del reto en el localStorage (simulación)
//   const savedChallenges: string[] = JSON.parse(localStorage.getItem('savedChallenges') ?? '[]')

//   if (!savedChallenges.includes(this.idChallenge)) {
//     savedChallenges.push(this.idChallenge)
//     localStorage.setItem('savedChallenges', JSON.stringify(savedChallenges))
//     console.log(`Desafío ${this.idChallenge} guardado`)
//   }
// }

// openSendSolutionModal (): void {
//   const modalRef = this.modalService.open(SendSolutionModalComponent, {
//     centered: true,
//     size: 'lg'
//   })
//   modalRef.componentInstance.idChallenge = this.idChallenge
// }

// async startingChallenge (): Promise<void> {
//   console.log('startingChallenge called with startChallenge:', this.onStartChallenge)

//   if (typeof this.onStartChallenge === 'function') {
//     try {
//       await this.onStartChallenge() // Esperar a que la promesa se resuelva
//       this.showEditor = true
//       this.isEditorReduced = false
//       this.cdr.detectChanges()
//     } catch (error) {
//       console.error('Error al iniciar el desafío:', error)
//     }
//   }
// }

// loadSolutions (idChallenge: string, idLanguage: string): void {
//   this.solutionService
//     .getAllChallengeSolutions(idChallenge, idLanguage)
//     .subscribe((data) => {
//       console.log('Raw data from API:', data)
//       if (data.results.length > 0) {
//         this.challengeSolutions = data.results
//         console.log('Challenge Solutions Loaded:', this.challengeSolutions)
//       } else {
//         console.log('No solutions found or data format issue')
//       }
//     })
// }
