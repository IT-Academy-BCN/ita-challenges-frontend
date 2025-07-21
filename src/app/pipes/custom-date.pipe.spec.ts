import { TranslateService } from '@ngx-translate/core';
import { CustomDatePipe } from './custom-date.pipe';

describe('CustomDatePipe', () => {
    let translateMock: Partial<TranslateService>
    beforeEach(() => {
    translateMock = {
      currentLang: 'ca'
    }
  })

  it('should format the date as "1 Gen 2025" in Catalan', () => {
    const pipe = new CustomDatePipe(translateMock as TranslateService)
    const result = pipe.transform(new Date(2025, 0, 1))
    expect(result).toBe("1 Gen 2025")
  })

  it('should format the date as "1 Ene 2025" in Spanish', () => {
    translateMock.currentLang = "es"
    const pipe = new CustomDatePipe(translateMock as TranslateService)
    const result = pipe.transform(new Date(2025, 0, 1))
    expect(result).toBe("1 Ene 2025")
  })

  it('should format the date as "1 Jan 2025" in English', () => {
    translateMock.currentLang = 'en'
    const pipe = new CustomDatePipe(translateMock as TranslateService)
    const result = pipe.transform(new Date(2025, 0, 1))
    expect(result).toBe('1 Jan 2025')
  })

  it("should return empty string for null value", () => {
    const pipe = new CustomDatePipe(translateMock as TranslateService)
    const result = pipe.transform(null)
    expect(result).toBe("")
  });

  it('should return empty string for undefined value', () => {
    const pipe = new CustomDatePipe(translateMock as TranslateService)
    const result = pipe.transform(undefined)
    expect(result).toBe('')
  });

  it('should return empty string for invalid date string', () => {
    const pipe = new CustomDatePipe(translateMock as TranslateService)
    const result = pipe.transform('invalid-date')
    expect(result).toBe('')
  });

  it('should fallback to English month names if language is unknown', () => {
    translateMock.currentLang = 'fr'
    const pipe = new CustomDatePipe(translateMock as TranslateService)
    const result = pipe.transform(new Date(2025, 0, 1))
    expect(result).toBe('1 Jan 2025')
  })
})
