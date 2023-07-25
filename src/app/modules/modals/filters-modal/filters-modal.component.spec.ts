import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FiltersModalComponent } from './filters-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DebugElement } from '@angular/core';

describe('FiltersModalComponent', () => {
  let component: FiltersModalComponent;
  let fixture: ComponentFixture<FiltersModalComponent>;
  let mockModalService: any;
  let el: DebugElement;

  beforeEach(async () => {
    mockModalService = { dismissAll: jasmine.createSpy('dismissAll') };


    await TestBed.configureTestingModule({
      declarations: [ FiltersModalComponent ],
      imports: [ FormsModule, ReactiveFormsModule ],
      providers: [ 
        { provide: NgbModal, useValue: mockModalService } 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
  expect(component).toBeTruthy();
  });

  it('should call dismissAll when applyFiltersAndClose is called', () => {
  component.applyFiltersAndClose('test');
  expect(mockModalService.dismissAll.calls.count()).toBe(1);
  });

  it('should call dismissAll when "Cancelar" button is clicked', () => {
  const cancelButton = el.query(By.css('#cancelButton')).nativeElement;
  cancelButton.click();
  expect(mockModalService.dismissAll.calls.count()).toBe(1);
  });
  
  it('should correctly update form state when checkboxes are clicked', fakeAsync(() => {
  const javascriptCheckbox = el.query(By.css('#checkJs')).nativeElement;

  expect(component.filtersForm.get('languages.javascript')!.value).toBeFalsy();
  
  javascriptCheckbox.click();
  tick();

  expect(component.filtersForm.get('languages.javascript')!.value).toBeTruthy();
}));



  it('should emit selected filters after "Apply" button is clicked', fakeAsync(() => {
    spyOn(component.filtersSelected, 'emit');

    const javascriptCheckbox = el.query(By.css('#checkJs')).nativeElement;
    const easyCheckbox = el.query(By.css('#checkEasy')).nativeElement;
    const noStartedCheckbox = el.query(By.css('#checkNoStarted')).nativeElement;

    javascriptCheckbox.click();
    easyCheckbox.click();
    noStartedCheckbox.click();
    tick();

    // Apply filters and close
    const applyButton = el.query(By.css('.btn-change')).nativeElement;
    applyButton.click();
    tick();

    // Check that the filtersSelected event was emitted with the correct data
    expect(component.filtersSelected.emit).toHaveBeenCalledWith({
      languages: [1], 
      levels: ['easy'], 
      progress: [1]
    });
  }));

});

