import { Example } from './challenge-example.model';

describe('ChallengeDetails', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
      id_example: 'test id',
      example_text: 'test text'
    };

    const challengeExample = new Example(elementMock);

    expect(challengeExample.id_example).toEqual(elementMock.id_example);
    expect(challengeExample.example_text).toEqual(elementMock.example_text);
  });
});