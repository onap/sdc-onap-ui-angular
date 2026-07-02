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
});
