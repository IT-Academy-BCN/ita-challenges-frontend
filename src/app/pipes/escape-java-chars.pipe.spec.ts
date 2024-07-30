import {EscapeJavaForJsonPipe} from "./escape-java-for-json.pipe";

describe('EscapeJavaPipe', () => {
  let pipe: EscapeJavaForJsonPipe

  beforeEach(() => {
    pipe = new EscapeJavaForJsonPipe()
  })

  it('should escape special Java characters', () => {
    expect(pipe.transform('Hello "World"')).toEqual('Hello \\"World\\"')
    expect(pipe.transform('"')).toEqual('\\"')
    expect(pipe.transform('Backslash \\ test')).toEqual('Backslash \\\\ test')
    expect(pipe.transform('Backspace \\f test')).toEqual('Backspace \\\\f test')
    expect(pipe.transform('Form feed \\n test')).toEqual('Form feed \\\\n test')
    expect(pipe.transform('Form feed \\r test')).toEqual('Form feed \\\\r test')
    expect(pipe.transform('Form feed \\t test')).toEqual('Form feed \\\\t test')
  })

  it('should return the original string if no escaping is needed', () => {
    const testString = 'Hello World'
    expect(pipe.transform(testString)).toEqual(testString)
  })
})
