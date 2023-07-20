import { Solution } from './solution.model';

describe('Solution', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
      id_solution: 'Test ID',
      solution_text: 'Test Solution Text'
    };

    const solution = new Solution(elementMock);

    expect(solution.idSolution).toEqual(elementMock.id_solution);
    expect(solution.solutionText).toEqual(elementMock.solution_text);
  });
});
