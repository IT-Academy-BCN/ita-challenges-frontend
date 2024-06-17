import { Component, Input, type OnInit, type OnDestroy, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from './../../../modals/restricted-modal/restricted-modal.component'
import { SolutionService } from '../../../../services/solution.service'
import { AuthService } from 'src/app/services/auth.service'
import { type Subscription } from 'rxjs'
import { Router } from '@angular/router'

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss']
})
export class ChallengeHeaderComponent implements OnInit, OnDestroy {
  private readonly modalService = inject(NgbModal)
  private readonly solutionService = inject(SolutionService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  @Input() title = ''
  @Input() creation_date!: Date
  @Input() level = ''
  @Input() activeId!: number

  isLogged: boolean = false
  solutionSent: boolean = false
  private solutionSentSubscription!: Subscription

  ngOnInit (): void {
    this.isLogged = this.authService.isUserLoggedIn()
    this.solutionSentSubscription = this.solutionService.solutionSent$.subscribe((value) => {
      this.solutionSent = value
    })
  }

  ngOnDestroy (): void {
    if (this.solutionSentSubscription != null) {
      this.solutionSentSubscription.unsubscribe()
    }
  }

  openSendSolutionModal (): void {
    this.modalService.open(SendSolutionModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  clickSendButton (): void {
    if (!this.isLogged) {
      this.openRestrictedModal()
    } else {
      this.solutionService.sendSolution('') // Considera pasar la solución como argumento si es necesario
    }
  }

  private openRestrictedModal (): void {
    this.modalService.open(RestrictedModalComponent, {
      centered: true,
      size: 'lg'
    })
  }
}
