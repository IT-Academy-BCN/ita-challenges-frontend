import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ResourceCardComponent } from './resource-card.component'
import { ResourcesService } from 'src/app/services/resources.service'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { TranslateModule, TranslateService } from '@ngx-translate/core'
import { responseMock } from 'src/mocks/resources/response.mock'

describe('ResourceCardComponent', () => {
  let component: ResourceCardComponent
  let fixture: ComponentFixture<ResourceCardComponent>
  let resourcesServiceMock: any

  beforeEach(async () => {
    resourcesServiceMock = {
      getResources: jest.fn().mockReturnValue(of([]))
    }

    await TestBed.configureTestingModule({
      declarations: [ResourceCardComponent],
      imports: [
        TranslateModule.forRoot() // Asegúrate de importar TranslateModule
      ],
      providers: [
        { provide: ResourcesService, useValue: resourcesServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        TranslateService // Provee TranslateService si es necesario
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ResourceCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges() // Asegúrate de llamar a detectChanges después de crear el componente
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should ngOnInit load resources correctly', async () => {
    resourcesServiceMock.getResources.mockReturnValue(of([responseMock]))

    component.ngOnInit()
    await fixture.whenStable().then(() => {
    // Si conoces el valor exacto de formattedDate, añádelo a responseMock y compara como antes
    // expect(component.resources).toEqual(responseMock);

      // Si no conoces el valor exacto o si varía, puedes usar expect.objectContaining para verificar partes del objeto
      expect(component.resources).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: 'e7b6b5a0-5b0a-4b0e-8b0a-9b0a0b0a0b0a',
          title: 'Tutorial completo de Angular desde cero'
        // Añade aquí más campos si es necesario
        })
      ]))
    }).catch()
  })

  it('should ngOnInit handle error from service', async () => {
    const errorMessage = 'Error fetching resources'

    resourcesServiceMock.getResources.mockReturnValue(throwError(() => new Error(errorMessage)))

    fixture.detectChanges()

    await fixture.whenStable().then(() => {
      expect(component.resources).toEqual([])
    }).catch()
  })
})
