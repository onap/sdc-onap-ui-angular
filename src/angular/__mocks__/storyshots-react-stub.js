// Stub for the React-only modules that @storybook/addon-storyshots' framework
// loader `require`s eagerly at import time.
//
// This is an Angular-only project, so `@storybook/react`, `react-test-renderer`
// and `react-test-renderer/shallow` are not installed. Storyshots' frameworkLoader
// (node_modules/@storybook/addon-storyshots/dist/frameworkLoader.js) nonetheless
// `require`s every framework loader — react, react-native, angular, vue, html —
// at the top of the file before any of them runs. The React and React-Native
// loaders pull in `@storybook/react/options` and `react-test-renderer`, which
// would throw MODULE_NOT_FOUND under Jest and abort story loading.
//
// Only the Angular loader's `test()` ever matches (we always render with the
// Angular framework), so the React code paths are never executed. Mapping the
// missing React modules to this empty stub via jest.config.js `moduleNameMapper`
// lets the eager top-level requires succeed without pulling React into the repo.
module.exports = {};
