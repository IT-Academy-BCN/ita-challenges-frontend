import { Component, ViewChild, inject, type TemplateRef } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss']
})
export class FiltersModalComponent {
  @ViewChild('modal') private readonly modalContent!: TemplateRef<FiltersModalComponent>
  private readonly modalService = inject(NgbModal)
  private readonly authService = inject(AuthService)

  public isUserLoggedIn?: boolean

  open (): void {
    this.modalService.open(this.modalContent, { size: 'lg' })
  }

  constructor () {
    this.isUserLoggedIn = this.authService.isUserLoggedIn()
  }
}
