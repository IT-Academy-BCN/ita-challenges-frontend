import { FormatDatePipe } from './format-date.pipe'

describe('FormatDatePipe', () => {
  let pipe: FormatDatePipe

  beforeEach(() => {
    pipe = new FormatDatePipe()
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy()
  })

  it('transforms date correctly', () => {
    const inputDate = '2023-05-20T00:00:00.000Z'
    const expectedOutput = 'May 20, 2023'
    expect(pipe.transform(inputDate)).toEqual(expectedOutput)
  })
})
