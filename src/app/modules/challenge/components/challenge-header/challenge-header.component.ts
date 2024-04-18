import { Component, Input, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from './../../../modals/restricted-modal/restricted-modal.component'
import { SolutionService } from '../../../../services/solution.service'

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss']
})
export class ChallengeHeaderComponent {
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: number

  challenge_title: string | undefined = 'hola'
  challenge_date: Date | undefined
  challenge_level: string | undefined

  isLogged: boolean = true // & tiene que estar en true para que este logueado
  solutionSent: boolean = false

  ngOnInit (): void {
    this.challenge_title = this.title
    this.challenge_date = this.creation_date
    this.challenge_level = this.level

    this.solutionService.solutionSent$.subscribe((value) => {
      this.solutionSent = value
    })
  }

  openSendSolutionModal (): void {
    this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  clickSendButton (): void {
    if (!this.isLogged) {
      this.modalService.open(RestrictedModalComponent, {
        centered: true,
        size: 'lg'
      })
    } else {
      this.solutionService.sendSolution('') // Puedes pasar la solución como argumento si es necesario
    }
  }
}
