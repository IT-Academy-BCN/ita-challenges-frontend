import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from '../../../modules/modals/register-modal/register-modal.component';

@Component({
  selector: 'app-solutions-unlogged-button',
  templateUrl: './solutions-unlogged-button.component.html',
  styleUrls: ['./solutions-unlogged-button.component.scss']
})
export class SolutionsUnloggedButtonComponent {

  constructor(private modalService: NgbModal) {}

 openRegisterModal(){
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
  }
}
