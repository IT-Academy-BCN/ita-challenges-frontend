import { DataChallenge } from './data-challenge.model';

describe('DataChallenge', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
      count: 10,
      offset: 0,
      limit: 5,
      results: [
        {
      id_challenge: 'Test ID',
      challenge_title: 'Test Title',
      level: 'Test Level',
      creation_date: new Date(),
      popularity: 123,
        details: { description: 'description', examples: [{ id_example: '1', example_text: 'text' }], notes: 'notes' },
      languages: [{id_language:'1', language_name:'javascript'}],
      solutions: [{idSolution:'solution', solutionTxt:'text'}],
      resources: [{idResource: '1', resourceDescription:'description', author:'Author', generationDate:new Date()}],
      related: ['related1', 'related2']
    }
      ]
    };

    const dataChallenge = new DataChallenge(elementMock);

    expect(dataChallenge.count).toEqual(elementMock.count);
    expect(dataChallenge.offset).toEqual(elementMock.offset);
    expect(dataChallenge.limit).toEqual(elementMock.limit);
    expect(dataChallenge.challenges).toEqual(elementMock.results);
  });
});
