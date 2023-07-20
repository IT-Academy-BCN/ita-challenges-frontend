import { Language } from './language.model';

describe('Language', () => {
  it('should correctly assign values in the constructor', () => {
    const elementMock = {
      id_language: 'Test ID',
      language_name: 'Test Language'
    };

    const language = new Language(elementMock);

    expect(language.id_language).toEqual(elementMock.id_language);
    expect(language.language_name).toEqual(elementMock.language_name);
  });
});
