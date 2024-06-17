import { TestBed } from '@angular/core/testing'
import { DateFormatterService } from './date-formatter.service'
import { TranslateService } from '@ngx-translate/core'

describe('DateFormatterService', () => {
  let service: DateFormatterService
  let translateService: TranslateService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslateService,
          useValue: {
            currentLang: 'en'
          }
        }
      ]
    })
    service = TestBed.inject(DateFormatterService)
    translateService = TestBed.inject(TranslateService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should format date correctly in English', () => {
    translateService.currentLang = 'en'
    const date = new Date('2023-04-01')
    expect(service.format(date)).toEqual('April 01, 2023')
  })

  it('should format date correctly in Spanish', () => {
    translateService.currentLang = 'es'
    const date = new Date('2023-04-01')
    expect(service.format(date)).toEqual('01 abril 2023')
  })

  it('should use default pattern if language is not supported', () => {
    translateService.currentLang = 'fr' // French is not supported, so it should fall back to default
    const date = new Date('2023-04-01')
    expect(service.format(date)).toEqual('01 d’abril 2023') // Assuming default is Catalan
  })
})
