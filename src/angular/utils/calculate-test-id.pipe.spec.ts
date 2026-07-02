import { CalculateTestIdPipe } from './calculate-test-id.pipe';

// A pure transform: builds a kebab-cased test id, optionally prefixed by a
// container id. Exercised directly, no TestBed needed.
describe('CalculateTestIdPipe', () => {
    let pipe: CalculateTestIdPipe;

    beforeEach(() => {
        pipe = new CalculateTestIdPipe();
    });

    it('returns an empty string for a falsy value', () => {
        expect(pipe.transform('', 'container')).toEqual('');
        expect(pipe.transform(undefined, 'container')).toEqual('');
    });

    it('lower-cases and hyphenates the value when no container id is given', () => {
        expect(pipe.transform('My Label', undefined)).toEqual('my-label');
    });

    it('prefixes the value with the container id when one is given', () => {
        expect(pipe.transform('My Label', 'panel')).toEqual('panel-my-label');
    });
});
