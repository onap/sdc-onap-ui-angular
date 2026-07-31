import { Injectable } from '@angular/core';
import { NotificationSettings } from '../utilities/notification.config'
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class NotificationsService  {

    notifs: NotificationSettings[] = [];

    notifQueue: Subject<any> = new Subject<any>();

    /**
     * Commands the container to drop an already-displayed notification. A null payload means
     * "drop all of them". Kept separate from notifQueue so a dismiss can never be mistaken for a
     * new notification by an existing subscriber.
     */
    dismissQueue: Subject<NotificationSettings> = new Subject<NotificationSettings>();

    constructor() {}

    public push(notif: NotificationSettings): void {

        if ( this.notifQueue.observers.length > 0 ) {
            this.notifQueue.next(notif);
        } else {
            this.notifs.push(notif);
        }
    }

    public getNotifications(): NotificationSettings[] {
        return this.notifs;
    }

    public subscribe(observer): Subscription {
        const s: Subscription = this.notifQueue.subscribe(observer);
        this.notifs.forEach(notif => this.notifQueue.next(notif));
        this.notifs = [];
        return s;
    }

    /**
     * Removes a single notification, whether it is already on screen or still buffered because no
     * container has subscribed yet. Dismissing a notification that is not (or is no longer) present
     * is a no-op, so callers need not track whether it has already expired on its own.
     */
    public dismiss(notif: NotificationSettings): void {
        const index: number = this.notifs.indexOf(notif);
        if (index !== -1) {
            this.notifs.splice(index, 1);
        }
        this.dismissQueue.next(notif);
    }

    /**
     * Removes every notification. Clears the buffer as well as the displayed set, otherwise a
     * container subscribing later would flush notifications the caller has already dismissed.
     */
    public dismissAll(): void {
        this.notifs = [];
        this.dismissQueue.next(null);
    }

    public subscribeToDismiss(observer): Subscription {
        return this.dismissQueue.subscribe(observer);
    }

}
