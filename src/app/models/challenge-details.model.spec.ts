import { ChallengeDetails } from './challenge-details.model';

describe('ChallengeDetails', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
      description: 'Test description',
      notes: 'Test notes',
      examples: [{id_example: '1', example_text: 'Test example'}]
    };

    const challengeDetails = new ChallengeDetails(elementMock);

    expect(challengeDetails.description).toEqual(elementMock.description);
    expect(challengeDetails.notes).toEqual(elementMock.notes);
    expect(challengeDetails.examples[0].id_example).toEqual(elementMock.examples[0].id_example);
    expect(challengeDetails.examples[0].example_text).toEqual(elementMock.examples[0].example_text);
  });
});
