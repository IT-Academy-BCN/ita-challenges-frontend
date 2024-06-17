import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { ProfileComponent } from './profile.component'
import { ProfileHeaderComponent } from '../profile-header/profile-header.component'
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'
import { DateFormatterService } from 'src/app/services/date-formatter.service'

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
        provideHttpClientTesting(),
        // Mockea DateFormatterService y su método format para evitar el error de fecha inválida
        {
          provide: DateFormatterService,
          useValue: {
            format: () => 'Mocked Date' // Retorna un valor mockeado para la fecha
          }
        }
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
