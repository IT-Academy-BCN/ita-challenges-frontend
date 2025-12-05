import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { TranslateModule } from "@ngx-translate/core";
import { ChallengeService } from "src/app/services/challenge.service";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { DeleteChallengeModalComponent } from "./delete-challenge-modal.component";

describe("DeleteChallengeModalComponent", () => {
  let component: DeleteChallengeModalComponent;
  let fixture: ComponentFixture<DeleteChallengeModalComponent>;
  let mockChallengeService: { deleteChallenge: any };
  let mockModalService: { open: any; dismissAll: any };
  let mockToastr: { success: any; error: any };
  let mockRouter: { navigate: any };
  const testIdChallenge = "12345";

  beforeEach(async () => {
    mockChallengeService = {
      deleteChallenge: () => of({ success: true }),
    };
    mockModalService = {
      open: jasmine.createSpy("open"),
      dismissAll: jasmine.createSpy("dismissAll"),
    };
    mockToastr = {
      success: jasmine.createSpy("success"),
      error: jasmine.createSpy("error"),
    };
    mockRouter = {
      navigate: jasmine.createSpy("navigate"),
    };
    await TestBed.configureTestingModule({
      declarations: [DeleteChallengeModalComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: ChallengeService, useValue: mockChallengeService },
        { provide: NgbModal, useValue: mockModalService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteChallengeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should close modal when closeModal is called", () => {
    component.closeModal();
    expect(mockModalService.dismissAll).toHaveBeenCalled();
  });
  it("should call deleteChallenge and close modal and show success toastr on successful deletion", () => {
    const spyDelete = spyOn(
      mockChallengeService,
      "deleteChallenge"
    ).and.returnValue(of({}));
    const spyClose = spyOn(component, "closeModal");
    component.idChallenge = testIdChallenge;
    component.deleteChallenge();
    expect(spyDelete).toHaveBeenCalledWith(testIdChallenge);
    expect(mockToastr.success).toHaveBeenCalled();
    expect(spyClose).toHaveBeenCalled();
  });
  it("should handle error and show error toastr on deletion", () => {
    const mockError = new Error("Deletion failed");
    const spyDelete = spyOn(
      mockChallengeService,
      "deleteChallenge"
    ).and.returnValue(throwError(() => mockError));
    const spyClose = spyOn(component, "closeModal");
    component.idChallenge = testIdChallenge;
    component.deleteChallenge();
    expect(spyDelete).toHaveBeenCalledWith(testIdChallenge);
    expect(mockToastr.error).toHaveBeenCalled();
    expect(spyClose).toHaveBeenCalled();
  });
  it("should navigate to challenges list on successful deletion", () => {
    component.idChallenge = testIdChallenge;
    component.deleteChallenge();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/ita-challenge/challenges",
    ]);
  });
});