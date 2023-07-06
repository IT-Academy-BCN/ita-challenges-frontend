import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictedModalComponent } from './restricted-modal.component';

describe('RestrictedModalComponent', () => {
  let component: RestrictedModalComponent;
  let fixture: ComponentFixture<RestrictedModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestrictedModalComponent]
    });
    fixture = TestBed.createComponent(RestrictedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
