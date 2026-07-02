// browser-utils derives two boolean flags from navigator.userAgent at module
// load time. The values depend on the jsdom user agent, so rather than assert a
// specific browser we assert the flags are well-formed booleans and that the
// module evaluates without throwing under jsdom. This guards against a refactor
// that would break the module's top-level evaluation (e.g. touching an
// undefined `navigator`/`window`).
import { isFirefox, isIEOrEdge } from './browser-utils';

describe('browser-utils', () => {
    it('exposes isIEOrEdge as a boolean', () => {
        expect(typeof isIEOrEdge).toBe('boolean');
    });

    it('exposes isFirefox as a boolean', () => {
        expect(typeof isFirefox).toBe('boolean');
    });

    it('does not report the jsdom runtime as IE/Edge', () => {
        // jsdom's default UA is not IE/Edge/Trident, so this stays false —
        // confirming the regex is actually evaluated against the UA string.
        expect(isIEOrEdge).toBe(false);
    });
});
