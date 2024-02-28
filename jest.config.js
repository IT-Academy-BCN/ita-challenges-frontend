// jest.config.js
const esModules = ['@angular', '@ngrx', 'd3'];

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    transformIgnorePatterns: [
       `<rootDir>/node_modules/.pnpm/(?!.*\\.mjs$|${esModules.join('|')}@)`,        
    ],
    modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
    testRunner: 'jest-jasmine2',
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
      },
};