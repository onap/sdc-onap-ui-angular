import { LoaderComponent } from './loader.component';
import { LoaderService } from './loader.service';

// LoaderService is a plain injectable registry that forwards
// activate/deactivate to registered loaders. It is tested directly with a
// lightweight loader stub instead of a real LoaderComponent (which needs the
// service injected and a template).
describe('LoaderService', () => {
    let service: LoaderService;

    const makeLoaderStub = () => {
        const stub = {
            activated: 0,
            deactivated: 0,
            activate() { this.activated++; },
            deactivate() { this.deactivated++; }
        };
        return stub as {} as LoaderComponent & { activated: number; deactivated: number };
    };

    beforeEach(() => {
        service = new LoaderService();
    });

    it('registers a loader under a name', () => {
        const loader = makeLoaderStub();
        service.register('main', loader);
        expect(service.registeredLoaders['main']).toBe(loader);
    });

    it('does not overwrite an already-registered name', () => {
        const first = makeLoaderStub();
        const second = makeLoaderStub();
        service.register('main', first);
        service.register('main', second);
        expect(service.registeredLoaders['main']).toBe(first);
    });

    it('unregisters a loader', () => {
        const loader = makeLoaderStub();
        service.register('main', loader);
        service.unregister('main');
        expect(service.registeredLoaders['main']).toBeUndefined();
    });

    it('activates and deactivates a registered loader by name', () => {
        const loader = makeLoaderStub();
        service.register('main', loader);
        service.activate('main');
        service.deactivate('main');
        expect((loader as {} as { activated: number }).activated).toEqual(1);
        expect((loader as {} as { deactivated: number }).deactivated).toEqual(1);
    });

    it('is a no-op when activating an unknown loader name', () => {
        expect(() => service.activate('missing')).not.toThrow();
    });
});
