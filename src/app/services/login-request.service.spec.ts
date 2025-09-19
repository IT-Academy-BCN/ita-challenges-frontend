import { TestBed } from "@angular/core/testing";
import Swal, { SweetAlertResult } from "sweetalert2";
import { LoginRequestService } from "./login-request.service";

describe("LoginRequestService", () => {
  let service: LoginRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginRequestService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should call Swal.fire with correct options", async () => {
    const fireSpy = jest
      .spyOn(Swal, "fire")
      .mockResolvedValue({ isConfirmed: true } as SweetAlertResult);

    const result = await service.openLoginRequestModal();

    expect(fireSpy).toHaveBeenCalledTimes(1);

    const calledWith = fireSpy.mock.calls[0][0] as any;

    expect(calledWith.title).toBe("Inicio de sesión requerido");
    expect(calledWith.confirmButtonText).toBe("Ir a login");
    expect(calledWith.cancelButtonText).toBe("Cancelar");

    expect(result.isConfirmed).toBe(true);
  });
});
