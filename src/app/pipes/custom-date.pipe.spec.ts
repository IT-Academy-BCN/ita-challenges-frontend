import { CustomDatePipe } from './custom-date.pipe';

describe('CustomDatePipe', () => {
  it('should format the date as "1 Gen 2025"', () => {
    const pipe = new CustomDatePipe()
    const result = pipe.transform(new Date(2025, 0, 1))
    expect(result).toBe("1 Gen 2025")
  })
})
