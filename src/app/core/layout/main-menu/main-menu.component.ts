import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestrictedModalComponent } from '../../../modules/modals/restricted-modal/restricted-modal.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  
  constructor(private modalService: NgbModal){} 
  
  openRestrictedModal(){
    this.modalService.open(RestrictedModalComponent, { centered : true, size : 'lg' })
  }
}
