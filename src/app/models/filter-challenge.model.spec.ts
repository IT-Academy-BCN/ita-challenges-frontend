import { FilterChallenge } from './filter-challenge.model';

describe('FilterChallenge', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
      id_language: [1, 2, 3],
      id_levels: ['beginner', 'intermediate', 'advanced'],
      id_progress: [10, 20, 30]
    };

    const filterChallenge = new FilterChallenge(elementMock);

    expect(filterChallenge.languages).toEqual(elementMock.id_language);
    expect(filterChallenge.levels).toEqual(elementMock.id_levels);
    expect(filterChallenge.progress).toEqual(elementMock.id_progress);
  });
});
