import { Injectable } from "@angular/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class CommonModalService {
  constructor() {}

  loginRequestModal() {
    const options: SweetAlertOptions = {
      title: "Inicio de sesión requerido",
      text: "En caso de que no estés dado de alta, contacta con tu mentor",
      showCloseButton: true,
      showConfirmButton: false, 
      showCancelButton: false,  
      allowOutsideClick: true,
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
        htmlContainer: "custom-html-container",
      },
    };

  loadingPostingChallengeModal(): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      title: "Publicando reto",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
      },
    };
    return Swal.fire(options);
  }

  successPostingChallengeModal(): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      icon: "success",
      title: "Reto publicado",
      text: "¡Gracias por tu aporte!",
      confirmButtonText: "Ir a retos",
      showCloseButton: true,
      allowOutsideClick: true,
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
        htmlContainer: "custom-html-container",
        confirmButton: "custom-confirm-button",
      },
    };
    return Swal.fire(options);
  }

  errorPostingChallengeModal(errorMessage: string): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      icon: "error",
      title: "Error al publicar reto",
      text: errorMessage,
      confirmButtonText: "Volver",
      showCloseButton: true,
      allowOutsideClick: true,
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
        htmlContainer: "custom-html-container",
        confirmButton: "custom-confirm-button",
      },
    };
    return Swal.fire(options);
  }
}
