import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterModalComponent } from './../../../modules/modals/register-modal/register-modal.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent {
  
  constructor(private modalService: NgbModal){} 
  
  openRegisterModal(){
    this.modalService.open(RegisterModalComponent, { centered : true, size : 'lg' })
  }

}
