import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { ResourceCardComponent } from './resource-card.component'
import { ResourcesService } from 'src/app/services/resources.service'
import { HttpClientModule } from '@angular/common/http'
import { of, throwError } from 'rxjs'

describe('ResourceComponent', () => {
  let component: ResourceCardComponent
  let fixture: ComponentFixture<ResourceCardComponent>
  let resourcesServiceMock: any

  beforeEach(async () => {
    resourcesServiceMock = {
      getResources: jest.fn().mockResolvedValue([])
    }

    await TestBed.configureTestingModule({
      declarations: [ResourceCardComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: ResourcesService, useValue: resourcesServiceMock }
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(ResourceCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    console.log(component)
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
      createdAt: 'Mar 25, 2023',
      updatedAt: 'Mar 25, 2023',
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

    fixture.detectChanges()

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
