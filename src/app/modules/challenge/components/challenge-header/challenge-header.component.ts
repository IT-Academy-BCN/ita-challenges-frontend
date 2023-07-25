import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component';
import { RestrictedModalComponent } from './../../../modals/restricted-modal/restricted-modal.component';

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss'],
})
export class ChallengeHeaderComponent {

  constructor(private modalService: NgbModal){}

  
  @Input() title = "";
  @Input() creation_date!: Date;
  @Input() level = "";

  challenge_title: string | undefined = 'hola';
  challenge_date: Date | undefined
  challenge_level: string | undefined
  
  ngOnInit(){
    this.challenge_title = this.title;
    this.challenge_date = this.creation_date
    this.challenge_level = this.level
  }

  openSendSolutionModal(){
    this.modalService.open(SendSolutionModalComponent, { centered : true, size : 'lg' })
  }

  openRestrictedModal(){
      this.modalService.open(RestrictedModalComponent, { centered : true, size : 'lg' })
  }
}
