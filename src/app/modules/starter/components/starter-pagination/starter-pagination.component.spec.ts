import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterPaginationComponent } from './starter-pagination.component';

describe('StarterPaginationComponent', () => {
  let component: StarterPaginationComponent;
  let fixture: ComponentFixture<StarterPaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarterPaginationComponent]
    });
    fixture = TestBed.createComponent(StarterPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
