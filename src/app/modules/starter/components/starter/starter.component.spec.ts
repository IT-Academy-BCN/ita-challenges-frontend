import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterComponent } from './starter.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('StarterComponent', () => {
  let component: StarterComponent;
  let fixture: ComponentFixture<StarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
        .compileComponents();

    fixture = TestBed.createComponent(StarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
