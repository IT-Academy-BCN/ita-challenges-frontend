import { TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { DynamicTranslatePipe } from './dynamic-translate.pipe'

class MockTranslateService {
  currentLang = 'en'
  onLangChange = new Subject<{ lang: string }>()

  use (lang: string): void {
    this.currentLang = lang
    this.onLangChange.next({ lang })
  }
}

describe('DynamicTranslatePipe', () => {
  let pipe: DynamicTranslatePipe
  let translateService: MockTranslateService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DynamicTranslatePipe,
        { provide: TranslateService, useClass: MockTranslateService }
      ]
    })

    pipe = TestBed.inject(DynamicTranslatePipe)
    translateService = TestBed.inject(TranslateService) as unknown as MockTranslateService
  })

  it('should be created', () => {
    expect(pipe).toBeTruthy()
  })

  it('should transform a language object into a string based on the current language', () => {
    const value = { en: 'Hello', es: 'Hola' }
    expect(pipe.transform(value)).toBe('Hello')
  })

  it('should update the returned string when the language changes', () => {
    const value = { en: 'Hello', es: 'Hola' }
    translateService.use('es')
    expect(pipe.transform(value)).toBe('Hola')
  })

  it('should retrun an empty string if the value is not an object', () => {
    const value = 'Hello'
    expect(pipe.transform(value)).toBe('')
  })

  it('should return an empty string if the value does not have a translation for the current language', () => {
    const value = { en: 'Hello' }
    translateService.use('es')
    expect(pipe.transform(value)).toBe('')
  })
})
