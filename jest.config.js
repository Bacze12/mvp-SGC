const { transform } = require("typescript");

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/tests'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};