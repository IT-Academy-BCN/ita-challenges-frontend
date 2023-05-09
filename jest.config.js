// jest.config.js
const esModules = ['@angular', '@ngrx', 'd3'];

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    transformIgnorePatterns: [
       `<rootDir>/node_modules/.pnpm/(?!.*\\.mjs$|${esModules.join('|')}@)`,        
    ],
    modulePathIgnorePatterns: ['<rootDir>/dist', '<rootDir>/node_modules'],
    testRunner: 'jest-jasmine2'
};