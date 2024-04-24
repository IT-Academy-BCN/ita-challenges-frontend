import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ResourceCardComponent } from './resource-card.component'
import { ResourcesService } from 'src/app/services/resources.service'
import { HttpClientModule } from '@angular/common/http'
import { of, throwError } from 'rxjs'
import { DatePipe } from '@angular/common'

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
      imports: [HttpClientModule],
      providers: [
        { provide: ResourcesService, useValue: resourcesServiceMock },
        { provide: DatePipe }
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ResourceCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should ngOnInit load resources correctly', async () => {
    const responseMock = [{
      id: 'e7b6b5a0-5b0a-4b0e-8b0a-9b0a0b0a0b0a',
      title: 'Tutorial completo de Angular desde cero',
      slug: 'tutorial-completo-de-angular-desde-cero',
      description: 'Tutorial completo de Angular desde cero hasta la creación de una aplicación de gestión de tareas',
      url: 'https://tutorials.cat/learn/angular',
      resourceType: 'BLOG',
      userId: 'string',
      categoryId: 'clocr0bi20000h8vwipfbazso',
      createdAt: '2023-11-28T15:24:13.961Z',
      updatedAt: '2023-11-28T15:24:13.961Z',
      user: {
        name: 'Ana Pérez'
      },
      topics: [
        {
          topic: {
            id: 'string',
            name: 'Angular',
            slug: 'angular',
            categoryId: 'string',
            createdAt: 'string',
            updatedAt: 'string'
          }
        }
      ],
      voteCount: {
        upvote: 14,
        downvote: 2,
        total: 12,
        userVote: 1
      },
      isFavorite: false
    }]

    resourcesServiceMock.getResources.mockReturnValue(of(responseMock))

    component.ngOnInit()

    const formatDate = component.formatDate(responseMock[0].createdAt)

    fixture.detectChanges()
    expect(formatDate).toBe('Nov 28, 2023')

    await fixture.whenStable().then(() => {
      expect(component.resources).toEqual(responseMock)
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
