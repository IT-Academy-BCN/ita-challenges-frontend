import { TestBed } from '@angular/core/testing'
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { DynamicTranslatePipe } from './dynamic-translate.pipe'

class MockTranslateService {
  currentLang = 'EN'
  onLangChange = new Subject<{ lang: string }>()

  use (lang: string): void {
    this.currentLang = lang.toUpperCase()
    this.onLangChange.next({ lang: this.currentLang })
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

  it('should transform a language object based on the current language', () => {
    const value = { EN: 'Hello', ES: 'Hola', CA: 'Hola' }
    expect(pipe.transform(value)).toBe('Hello')
  })

  it('should update the returned string when the language changes', () => {
    const value = { EN: 'Hello', ES: 'Hola' }
    translateService.use('ES')
    expect(pipe.transform(value)).toBe('Hola')
  })

  it('should return an empty string if the value is null or undefined', () => {
    [null, undefined].forEach(value => {
      expect(pipe.transform(value)).toBe('')
    })
  })

  it('should correctly parse and return a JSON string in the current language or return original if not found', () => {
    const cases = [
      { input: '{"EN": "Hello", "ES": "Hola"}', expected: 'Hello' },
      { input: '{"FR": "Bonjour"}', expected: '{"FR": "Bonjour"}' }
    ]
    cases.forEach(({ input, expected }) => {
      expect(pipe.transform(input)).toBe(expected)
    })
  })

  it('should return the original string if it is not a valid JSON or object', () => {
    const testStrings = [
      'Just a normal string',
      '{ES: "Sin comillas en claves"}'
    ]
    testStrings.forEach(value => {
      expect(pipe.transform(value)).toBe(value)
    })
  })

  it('should use the default language if currentLang is empty or undefined', () => {
    translateService.use('')
    const value = { EN: 'Hello', ES: 'Hola' }
    expect(pipe.transform(value)).toBe('Hola')
  })
})
