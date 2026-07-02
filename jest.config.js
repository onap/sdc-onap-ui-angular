// Jest configuration for the onap-ui-angular component library.
//
// Runs the existing Angular TestBed specs headlessly (jsdom) via
// jest-preset-angular, so no browser or Karma runner is required. The build
// pipeline (ngc + webpack UMD, pinned to legacy Node for node-sass) is
// independent of this and is unaffected.
//
// Two families of tests run here:
//   * hand-written *.spec.ts unit specs (component logic, pipes, services), and
//   * storyshots.spec.ts, which renders every Storybook story through TestBed as
//     a smoke test (see src/angular/storyshots.spec.ts).
module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/angular', '<rootDir>/stories'],
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
    moduleNameMapper: {
        // Storyshots' frameworkLoader eagerly requires every framework loader
        // (react, react-native, angular, vue, html) at import time. Only the
        // Angular loader ever runs here, but the React ones pull in modules that
        // are not installed in this Angular-only repo. Map them to an empty stub
        // so the unused top-level requires don't throw MODULE_NOT_FOUND.
        '^@storybook/react/options$': '<rootDir>/src/angular/__mocks__/storyshots-react-stub.js',
        '^react-test-renderer(/.*)?$': '<rootDir>/src/angular/__mocks__/storyshots-react-stub.js',
        // The Storybook welcome story imports global SCSS via webpack loader
        // syntax (`!style-loader!css-loader!sass-loader!./styles.scss`). Jest has
        // no webpack loaders, so stub the stylesheet import to an empty module.
        '\\.scss$': '<rootDir>/src/angular/__mocks__/storyshots-react-stub.js',
    },
    testMatch: ['**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'html', 'json'],
    // Coverage is measured across the whole component source, not just the files
    // a spec happens to import, so the report reflects true library coverage.
    collectCoverageFrom: [
        'src/angular/**/*.ts',
        '!src/angular/**/*.spec.ts',
        '!src/angular/**/*.html.ts',
        '!src/angular/**/*.d.ts',
        '!src/angular/**/index.ts',
        '!src/angular/components.ts',
        '!src/angular/services.ts',
        '!src/angular/test.ts',
        '!src/angular/polyfills.ts',
        '!src/angular/jest-setup.ts',
        '!src/angular/**/__mocks__/**',
    ],
    coverageDirectory: 'coverage',
    // 'html' produces the browsable report uploaded as a CI artifact; 'lcov' and
    // 'cobertura' are machine-readable for any downstream tooling; 'text-summary'
    // prints the totals to the job log.
    coverageReporters: ['html', 'lcov', 'cobertura', 'text-summary'],
    // A regression floor, set comfortably below the current numbers (statements
    // ~74%, branches ~49%, functions ~62%, lines ~72%) so ordinary variance does
    // not break CI but a meaningful coverage drop does. Raise these as coverage
    // grows; do not let them drift far below the actuals.
    coverageThreshold: {
        global: {
            statements: 70,
            branches: 44,
            functions: 58,
            lines: 67,
        },
    },
};
