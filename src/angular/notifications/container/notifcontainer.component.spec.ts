import { NotificationsService } from '../services/notifications.service';
import { NotificationSettings } from '../utilities/notification.config';
import { NotificationContainerComponent } from './notifcontainer.component';

// The container is a thin list around NotificationsService: ngOnInit subscribes to both the
// notification and dismiss queues, and the array it renders is the queue's arrival order. Only that
// wiring is tested here, by direct instantiation against a real service - no TestBed or template, so
// nothing depends on rendering or on the entry/exit animations.
describe('NotificationContainerComponent', () => {
    let service: NotificationsService;
    let component: NotificationContainerComponent;

    const makeNotif = (message: string) =>
        ({ message } as {} as NotificationSettings);

    beforeEach(() => {
        service = new NotificationsService();
        component = new NotificationContainerComponent(service);
    });

    it('renders notifications pushed after init, in push order', () => {
        component.ngOnInit();

        const first = makeNotif('first');
        const second = makeNotif('second');
        service.push(first);
        service.push(second);

        expect(component.notifications).toEqual([first, second]);
    });

    it('picks up notifications buffered before init', () => {
        const buffered = makeNotif('buffered');
        service.push(buffered);

        component.ngOnInit();

        expect(component.notifications).toEqual([buffered]);
    });

    it('removes a single notification on dismiss, keeping the others', () => {
        component.ngOnInit();
        const keep = makeNotif('keep');
        const drop = makeNotif('drop');
        service.push(keep);
        service.push(drop);

        service.dismiss(drop);

        expect(component.notifications).toEqual([keep]);
    });

    it('removes every notification on dismissAll', () => {
        component.ngOnInit();
        service.push(makeNotif('one'));
        service.push(makeNotif('two'));

        service.dismissAll();

        expect(component.notifications).toEqual([]);
    });

    it('ignores a dismiss for a notification it is not showing', () => {
        component.ngOnInit();
        const shown = makeNotif('shown');
        service.push(shown);

        service.dismiss(makeNotif('never-shown'));

        expect(component.notifications).toEqual([shown]);
    });

    it('stops receiving notifications and dismissals once destroyed', () => {
        component.ngOnInit();
        const shown = makeNotif('shown');
        service.push(shown);

        component.ngOnDestroy();
        service.push(makeNotif('after-destroy'));
        service.dismissAll();

        // The service outlives the container; a leaked subscription would mutate this array.
        expect(component.notifications).toEqual([shown]);
    });

    it('tolerates ngOnDestroy before ngOnInit', () => {
        expect(() => component.ngOnDestroy()).not.toThrow();
    });
});
