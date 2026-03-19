import { LoadingState } from './loading-state.enum';

describe('LoadingState Enum', () => {
  it('should have a LOADING value', () => {
    expect(LoadingState.LOADING).toBe('LOADING');
  });

  it('should have a SUCCESS value', () => {
    expect(LoadingState.SUCCESS).toBe('SUCCESS');
  });

  it('should have a ERROR value', () => {
    expect(LoadingState.ERROR).toBe('ERROR');
  });

});