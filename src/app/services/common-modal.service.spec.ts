import { TestBed } from "@angular/core/testing";
import Swal, { SweetAlertOptions } from "sweetalert2";
import { CommonModalService } from "./common-modal.service";

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe("CommonModalService", () => {
  let service: CommonModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonModalService],
    });
    service = TestBed.inject(CommonModalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

 it("loginRequestModal should show modal with 'De acuerdo' button", async () => {
  await service.loginRequestModal();

  expect(Swal.fire).toHaveBeenCalledTimes(1);
  const opts: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];

  expect(opts.title).toBe("Inicio de sesión requerido");
  expect(opts.text).toBe("En caso de que no estés dado de alta, contacta con tu mentor");
  expect(opts.showConfirmButton).toBe(true);       
  expect(opts.confirmButtonText).toBe("De acuerdo"); 
  expect(opts.showCancelButton).toBe(false);       
  expect(opts.showCloseButton).toBe(true);        
  expect(opts.customClass?.popup).toBe("custom-modal");
  expect(opts.customClass?.title).toBe("custom-title");
  expect(opts.customClass?.htmlContainer).toBe("custom-html-container");
  expect(opts.customClass?.confirmButton).toBe("custom-confirm-button");
});

  it("loadingPostingChallengeModal should call Swal.fire and show loading", () => {
    service.loadingPostingChallengeModal();

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    const opts: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];
    expect(opts.title).toBe("Publicando reto");
    expect(opts.allowOutsideClick).toBe(false);
    expect(opts.showConfirmButton).toBe(false);

    if (opts.didOpen) {
      opts.didOpen({} as HTMLElement);
      expect(Swal.showLoading).toHaveBeenCalledTimes(1);
    }
  });

  it("successPostingChallengeModal should call Swal.fire with success options", async () => {
    const result = await service.successPostingChallengeModal();

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    const opts: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];
    expect(opts.icon).toBe("success");
    expect(opts.title).toBe("Reto publicado");
    expect(opts.text).toBe("¡Gracias por tu aporte!");
    expect(opts.confirmButtonText).toBe("Ir a retos");
    expect(opts.customClass?.confirmButton).toBe("custom-confirm-button");
  });

  it("errorPostingChallengeModal should call Swal.fire with error options", async () => {
    const errorMsg = "Some backend error";
    const result = await service.errorPostingChallengeModal(errorMsg);

    expect(Swal.fire).toHaveBeenCalledTimes(1);
    const opts: SweetAlertOptions = (Swal.fire as jest.Mock).mock.calls[0][0];
    expect(opts.icon).toBe("error");
    expect(opts.title).toBe("Error al publicar reto");
    expect(opts.text).toBe(errorMsg);
    expect(opts.confirmButtonText).toBe("Volver");
  });
});
