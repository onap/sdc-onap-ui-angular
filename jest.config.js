// Jest configuration for the onap-ui-angular component library.
//
// Runs the existing Angular TestBed specs headlessly (jsdom) via
// jest-preset-angular, so no browser or Karma runner is required. The build
// pipeline (ngc + webpack UMD, pinned to legacy Node for node-sass) is
// independent of this and is unaffected.
module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/angular'],
    setupTestFrameworkScriptFile: '<rootDir>/src/angular/jest-setup.ts',
    globals: {
        'ts-jest': {
            tsConfigFile: 'src/angular/tsconfig.jest.json',
        },
        '__TRANSFORM_HTML__': true,
    },
    transform: {
        '^.+\\.(ts|js|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
    },
    // onap-ui-common ships ES-module sources (e.g. lib/icons-map.js uses
    // `export default`). node_modules is not transformed by default, so allow
    // this one package through the TypeScript/babel preprocessor.
    transformIgnorePatterns: ['node_modules/(?!(onap-ui-common)/)'],
    testMatch: ['**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'html', 'json'],
};
