import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SendSolutionModalComponent } from './send-solution-modal.component';
import { SolutionService } from '../../../services/solution.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('SendSolutionModalComponent', () => {
  let component: SendSolutionModalComponent;
  let fixture: ComponentFixture<SendSolutionModalComponent>;
  let modalService: NgbModal;
  let solutionService: SolutionService;

  beforeEach(() => {
    const solutionServiceSpy = {
      updateSolutionSentState: jest.fn(),
    };
  
    TestBed.configureTestingModule({
      declarations: [SendSolutionModalComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [NgbModal, { provide: SolutionService, useValue: solutionServiceSpy }],
    });

    fixture = TestBed.createComponent(SendSolutionModalComponent);
    component = fixture.componentInstance;

    // Obtén las instancias de los servicios después de crear el componente
    modalService = TestBed.inject(NgbModal);
    solutionService = TestBed.inject(SolutionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update solution sent state on acceptSolution()', () => {
    const updateSolutionSentStateSpy = spyOn(solutionService, 'updateSolutionSentState');
    component.acceptSolution();
    expect(updateSolutionSentStateSpy).toHaveBeenCalledWith(true);
  });

  it('should close modal on closeModal()', () => {
    const dismissAllSpy = spyOn(modalService, 'dismissAll');
    component.closeModal();
    expect(dismissAllSpy).toHaveBeenCalled();
  });
});
