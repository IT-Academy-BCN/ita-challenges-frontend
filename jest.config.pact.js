module.exports = {
    preset: 'jest-preset-angular',
    testMatch: ['**/+(*.)+(spec).(pact).(ts)'],
    setupFilesAfterEnv: ['<rootDir>/jest.config.js']
};