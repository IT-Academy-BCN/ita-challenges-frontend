import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FeedbackModalService {

  constructor() { }

  //EXAMPLE:Creating a "Challenge Saved" Modal
  challengeSavedModal(text: string): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      icon: 'success',
      title: 'Challenge saved!',
      text: text,
      confirmButtonText: 'OK',
      showCloseButton: true,
      allowOutsideClick: true
    };
    return Swal.fire(options);
  }
////////////

  loadingPostingChallengesModal(title: string): void {
    const options: SweetAlertOptions = {
      title: 'Posting challenge',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    };
    Swal.fire(options);
  }

  
  successPostingChallengeModal(title: string, text: string): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      icon: 'success',
      title: 'Challenge posted',
      text: 'Thank you for your contribution!',
      confirmButtonText: 'Go to challenges',
      showCloseButton: true,
      allowOutsideClick: true,
    };
    return Swal.fire(options);
  }


  errorPostingChallengeModal(text: string): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      icon: 'error', 
      title: 'Erros when posting challenge',
      text: 'Error message from backend.',
      confirmButtonText: 'Back',
      showCloseButton: true,
      allowOutsideClick: true,
    };
    return Swal.fire(options);
  }

 
  hideModal(): void {
    Swal.close();
  }
}

  

