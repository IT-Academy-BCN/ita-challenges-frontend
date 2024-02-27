import { Component, OnInit, Output, Input, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss']
})
export class FiltersModalComponent {
  @ViewChild('modal') private modalContent!: TemplateRef<FiltersModalComponent>

  constructor(private modalService: NgbModal) {}

  open() {
  this.modalService.open(this.modalContent, { size: 'lg' });
}

}
