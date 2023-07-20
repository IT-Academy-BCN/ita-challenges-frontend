import { Challenge } from './challenge.model';

describe('Challenge', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
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
    };

    const challenge = new Challenge(elementMock);

    expect(challenge.id_challenge).toEqual(elementMock.id_challenge);
    expect(challenge.challenge_title).toEqual(elementMock.challenge_title);
    expect(challenge.level).toEqual(elementMock.level);
    expect(challenge.creation_date).toEqual(elementMock.creation_date);
    expect(challenge.popularity).toEqual(elementMock.popularity);
    expect(challenge.details).toEqual(elementMock.details);
    expect(challenge.languages).toEqual(elementMock.languages);
    expect(challenge.solutions).toEqual(elementMock.solutions);
    expect(challenge.resources).toEqual(elementMock.resources);
    expect(challenge.related).toEqual(elementMock.related);
  });
});
