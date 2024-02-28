import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

import { ProfileComponent } from './profile.component';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent,
        ProfileHeaderComponent
      ],
      imports: [
        SharedComponentsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
