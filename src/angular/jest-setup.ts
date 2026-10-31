// Jest test environment bootstrap for Angular TestBed specs: wires up the
// zone.js test helpers and initializes the Angular testing environment.
// Referenced from jest.config.js.
import 'jest-preset-angular';
import registerRequireContextHook = require('babel-plugin-require-context-hook/register');

registerRequireContextHook();
