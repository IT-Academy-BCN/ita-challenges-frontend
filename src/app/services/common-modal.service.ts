import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class CommonModalService {
  private readonly translate = inject(TranslateService);

  loginRequestModal() {
  const options: SweetAlertOptions = {
    title: "Inicio de sesión requerido",
    text: "En caso de que no estés dado de alta, contacta con tu mentor",
    showCloseButton: true,      
    showConfirmButton: true,    
    showCancelButton: false,
    confirmButtonText: "De acuerdo", 
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

  deleteConfirmationModal(): Promise<SweetAlertResult> {
    const prefix = "modules.challenge.challengeForm";
    const options: SweetAlertOptions = {
      icon: "warning",
      title: this.translate.instant("modules.modals.solution.title"),
      text: this.translate.instant(`${prefix}.deleteConfirmMsg`),
      showCancelButton: true,
      confirmButtonText: this.translate.instant(`${prefix}.deleteConfirmBtn`),
      cancelButtonText: this.translate.instant("modules.modals.solution.btn-cancel"),
      showCloseButton: true,
      allowOutsideClick: true,
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
        htmlContainer: "custom-html-container",
        confirmButton: "custom-danger-button",
        cancelButton: "custom-cancel-button",
      },
    };
    return Swal.fire(options);
  }

  deleteSuccessModal(): Promise<SweetAlertResult> {
    const prefix = "modules.challenge.challengeForm";
    const options: SweetAlertOptions = {
      icon: "success",
      title: this.translate.instant(`${prefix}.deleteSuccessTitle`),
      text: this.translate.instant(`${prefix}.deleteSuccessMsg`),
      showCloseButton: true,
      allowOutsideClick: true,
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
        htmlContainer: "custom-html-container",
        confirmButton: "custom-danger-button",
      },
    };
    return Swal.fire(options);
  }

  deleteErrorModal(errorMessage: string): Promise<SweetAlertResult> {
    const prefix = "modules.challenge.challengeForm";
    const options: SweetAlertOptions = {
      icon: "error",
      title: this.translate.instant(`${prefix}.deleteErrorTitle`),
      text: errorMessage,
      showCloseButton: true,
      allowOutsideClick: true,
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
        htmlContainer: "custom-html-container",
        confirmButton: "custom-danger-button",
      },
    };
    return Swal.fire(options);
  }
}
