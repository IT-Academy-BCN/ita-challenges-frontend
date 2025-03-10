import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ProfileComponent } from './profile.component'
import { ProfileHeaderComponent } from '../profile-header/profile-header.component'
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'

describe('ProfileComponent', () => {
  let component: ProfileComponent
  let fixture: ComponentFixture<ProfileComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent,
        ProfileHeaderComponent
      ],
      imports: [
        SharedComponentsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
    fixture = TestBed.createComponent(ProfileComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
