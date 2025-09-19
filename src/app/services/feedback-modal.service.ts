import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult, SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FeedbackModalService {

  constructor() { }

  loadingChallengesModal(title: string): void {
    const options: SweetAlertOptions = {
      title: 'Loading challenge',
      icon: 'success', //this will be replaced for a loading spinner
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    };
    Swal.fire(options);
  }

  
  challengeCompletedModal(title: string, text: string): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      icon: 'success',
      title: 'Challenge completed',
      text: 'You have successfully completed a challenge!',
      confirmButtonText: 'OK'
    };
    return Swal.fire(options);
  }


  challengeSavedModal(text: string): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      icon: 'success', 
      title: 'Challenge saved',
      text: 'You have saved this challenge.',
      confirmButtonText: 'OK'
    };
    return Swal.fire(options);
  }

 
  hideModal(): void {
    Swal.close();
  }
}

  

