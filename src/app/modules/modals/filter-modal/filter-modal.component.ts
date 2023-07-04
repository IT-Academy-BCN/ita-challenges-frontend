import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent {
  @ViewChild('modal') private modalContent!: TemplateRef<FilterModalComponent>

  constructor(private modalService: NgbModal) {}

  open() {
  this.modalService.open(this.modalContent, { size: 'lg' });
}

}
