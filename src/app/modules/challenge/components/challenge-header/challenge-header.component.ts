import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendSolutionModalComponent } from './../../../modals/send-solution-modal/send-solution-modal.component';
import { RestrictedModalComponent } from './../../../modals/restricted-modal/restricted-modal.component';
import { SolutionService } from '../../../../services/solution.service';

@Component({
  selector: 'app-challenge-header',
  templateUrl: './challenge-header.component.html',
  styleUrls: ['./challenge-header.component.scss'],
})
export class ChallengeHeaderComponent {

  constructor(private modalService: NgbModal, private solutionService: SolutionService){}

  
  @Input() title = "";
  @Input() creation_date!: Date;
  @Input() level = "";

  challenge_title: string | undefined = 'hola';
  challenge_date: Date | undefined
  challenge_level: string | undefined

  userLoggedIn = true;
  
  ngOnInit(){
    this.challenge_title = this.title;
    this.challenge_date = this.creation_date
    this.challenge_level = this.level
  }

  openSendSolutionModal(){
    this.modalService.open(SendSolutionModalComponent, { centered : true, size : 'lg' })
  }

  clickSendButton() {
    if (!this.userLoggedIn) {
      this.modalService.open(RestrictedModalComponent, { centered: true, size: 'lg' })
    } else {
      this.solutionService.subject.next(2);
    }
  }


}
