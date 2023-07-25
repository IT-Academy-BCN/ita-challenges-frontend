import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersModalComponent } from './filters-modal.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent;
  let fixture: ComponentFixture<FiltersModalComponent>;
  let mockModalService;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    mockModalService.open.and.returnValue({ result: of('') });

    await TestBed.configureTestingModule({
      declarations: [FiltersModalComponent],
      providers: [{ provide: NgbModal, useValue: mockModalService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filters after clicking apply button', () => {
    spyOn(component.filtersSelected, 'emit');

    component.open(); // obrir el modal abans de les proves
    fixture.detectChanges();

    const applyButton = fixture.debugElement.query(By.css('[data-testid="applyButton"]'));

    // Verifica si l'element existeix abans de cridar la funció
    if (applyButton) {
      applyButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      expect(component.filtersSelected.emit).toHaveBeenCalled();
    } else {
      fail('Apply button not found'); // Falla la prova si l'element no es troba
    }
  });
});
