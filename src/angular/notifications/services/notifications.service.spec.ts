import { NotificationSettings } from '../utilities/notification.config';
import { NotificationsService } from './notifications.service';

// NotificationsService is a plain injectable queue: when there are no
// subscribers it buffers notifications, and on subscribe it flushes the buffer
// through the subject. Exercised directly, no TestBed needed.
describe('NotificationsService', () => {
    let service: NotificationsService;

    const makeNotif = (message: string) =>
        ({ message } as {} as NotificationSettings);

    beforeEach(() => {
        service = new NotificationsService();
    });

    it('buffers a pushed notification when there are no subscribers', () => {
        const notif = makeNotif('hello');
        service.push(notif);
        expect(service.getNotifications()).toEqual([notif]);
    });

    it('flushes buffered notifications to a new subscriber and clears the buffer', () => {
        const notif = makeNotif('hello');
        service.push(notif);

        const received: NotificationSettings[] = [];
        service.subscribe((n: NotificationSettings) => received.push(n));

        expect(received).toEqual([notif]);
        expect(service.getNotifications()).toEqual([]);
    });

    it('delivers a notification straight to an active subscriber without buffering', () => {
        const received: NotificationSettings[] = [];
        service.subscribe((n: NotificationSettings) => received.push(n));

        const notif = makeNotif('live');
        service.push(notif);

        expect(received).toEqual([notif]);
        expect(service.getNotifications()).toEqual([]);
    });

    it('stops delivering after the subscription is unsubscribed', () => {
        const received: NotificationSettings[] = [];
        const sub = service.subscribe((n: NotificationSettings) => received.push(n));
        sub.unsubscribe();

        service.push(makeNotif('after-unsub'));

        // No active observer left, so the notification is buffered, not delivered.
        expect(received).toEqual([]);
        expect(service.getNotifications().length).toEqual(1);
    });

    describe('dismiss', () => {
        it('emits the notification to dismiss subscribers', () => {
            const dismissed: NotificationSettings[] = [];
            service.subscribeToDismiss((n: NotificationSettings) => dismissed.push(n));

            const notif = makeNotif('displayed');
            service.dismiss(notif);

            expect(dismissed).toEqual([notif]);
        });

        it('removes a still-buffered notification so a later subscriber never sees it', () => {
            const buffered = makeNotif('buffered');
            service.push(buffered);
            service.dismiss(buffered);

            const received: NotificationSettings[] = [];
            service.subscribe((n: NotificationSettings) => received.push(n));

            expect(service.getNotifications()).toEqual([]);
            expect(received).toEqual([]);
        });

        it('leaves other buffered notifications untouched', () => {
            const keep = makeNotif('keep');
            const drop = makeNotif('drop');
            service.push(keep);
            service.push(drop);

            service.dismiss(drop);

            expect(service.getNotifications()).toEqual([keep]);
        });

        it('is a no-op for a notification that is not present', () => {
            const dismissed: NotificationSettings[] = [];
            service.subscribeToDismiss((n: NotificationSettings) => dismissed.push(n));
            service.push(makeNotif('present'));

            // Callers do not track expiry, so dismissing an unknown notification must not throw
            // or disturb the buffer.
            expect(() => service.dismiss(makeNotif('unknown'))).not.toThrow();
            expect(service.getNotifications().length).toEqual(1);
            expect(dismissed.length).toEqual(1);
        });
    });

    describe('dismissAll', () => {
        it('emits null to dismiss subscribers as the drop-everything signal', () => {
            const dismissed: NotificationSettings[] = [];
            service.subscribeToDismiss((n: NotificationSettings) => dismissed.push(n));

            service.dismissAll();

            expect(dismissed).toEqual([null]);
        });

        it('clears the buffer so a later subscriber is not flushed dismissed notifications', () => {
            service.push(makeNotif('one'));
            service.push(makeNotif('two'));

            service.dismissAll();

            const received: NotificationSettings[] = [];
            service.subscribe((n: NotificationSettings) => received.push(n));

            expect(service.getNotifications()).toEqual([]);
            expect(received).toEqual([]);
        });
    });
});
