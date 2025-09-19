import { Injectable } from "@angular/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class LoginRequestService {
  constructor() {}

  openLoginRequestModal(): Promise<SweetAlertResult> {
    const options: SweetAlertOptions = {
      title: "Inicio de sesión requerido",
      text: "En caso de que no estés dado de alta, contacta con tu mentor",
      showCloseButton: true,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Ir a login",
      cancelButtonText: "Cancelar",
      allowOutsideClick: true,
      customClass: {
        popup: "custom-modal",
        title: "custom-title",
        htmlContainer: "custom-html-container",
        confirmButton: "custom-confirm-button",
        cancelButton: "custom-cancel-button",
      },
    };

    return Swal.fire(options);
  }
}
