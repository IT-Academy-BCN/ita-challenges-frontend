import { Component, OnInit, Output, Input, ViewChild, type TemplateRef, EventEmitter } from '@angular/core'
import { type NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss']
})
export class FiltersModalComponent {
  @ViewChild('modal') private readonly modalContent!: TemplateRef<FiltersModalComponent>

  constructor (private readonly modalService: NgbModal) {}

  open () {
    this.modalService.open(this.modalContent, { size: 'lg' })
  }
}
