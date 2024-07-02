import { Component, Input, type OnInit, type OnDestroy, inject } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component'
import { RestrictedModalComponent } from './../../../modals/restricted-modal/restricted-modal.component'
import { SolutionService } from '../../../../services/solution.service'
import { AuthService } from 'src/app/services/auth.service'
import { type Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { DateFormatterService } from 'src/app/services/date-formatter.service'
import { TranslateService } from '@ngx-translate/core'

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
  private readonly dateFormatter = inject(DateFormatterService)
  private readonly translate = inject(TranslateService)
  private translateSubscription!: Subscription
  formattedDate: string = ''
  private _creation_date: string | Date | null = null

  @Input()
  set creation_date (value: Date | string) {
    this._creation_date = value
    this.updateFormattedDate()
  }

  get creation_date (): string | Date | null {
    return this._creation_date
  }

  @Input() title = ''
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
    this.updateFormattedDate()
    this.translateSubscription = this.translate.onLangChange.subscribe(() => {
      this.updateFormattedDate()
    })
  }

  ngOnDestroy (): void {
    if (this.solutionSentSubscription !== null && this.solutionSentSubscription !== undefined) {
      this.solutionSentSubscription.unsubscribe()
    }
    this.translateSubscription.unsubscribe()
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
      this.solutionService.sendSolution('')
    }
  }

  private openRestrictedModal (): void {
    this.modalService.open(RestrictedModalComponent, {
      centered: true,
      size: 'lg'
    })
  }

  updateFormattedDate (): void {
    if (this._creation_date instanceof Date) {
      this.formattedDate = this.dateFormatter.format(this._creation_date)
    } else if (typeof this._creation_date === 'string' && this._creation_date.trim() !== '') {
      const date = new Date(this._creation_date)
      if (!isNaN(date.getTime())) {
        this.formattedDate = this.dateFormatter.format(date)
      } else {
        console.warn('ChallengeHeaderComponent.updateFormattedDate: creation_date is an invalid string')
        this.formattedDate = ''
      }
    } else if (this._creation_date === null) {
    // Manejar explícitamente el caso null sin emitir una advertencia.
      this.formattedDate = ''
    } else {
    // Opcional: Manejar otros casos inesperados, si los hay.
    }
  }
}
