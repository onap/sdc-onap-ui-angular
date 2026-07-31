import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NotificationSettings } from "../utilities/notification.config";
import { NotificationsService } from "../services/notifications.service";
import { template } from "./notifcontainer.component.html";

@Component({
    selector: "sdc-notification-container",
    template: template
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
    notifications: NotificationSettings[] = [];

    private notifSubscription: Subscription;
    private dismissSubscription: Subscription;

    constructor(private notify: NotificationsService) {
    }

    public ngOnInit() {
        this.notifSubscription = this.notify.subscribe((notif: NotificationSettings) => {
            this.notifications.push(notif);
        });
        this.dismissSubscription = this.notify.subscribeToDismiss((notif: NotificationSettings) => {
            this.onDismiss(notif);
        });
    }

    public ngOnDestroy() {
        /* The service outlives the container, so an undisposed subscription keeps delivering to a
           destroyed component - and leaks the component with it. */
        if (this.notifSubscription) {
            this.notifSubscription.unsubscribe();
        }
        if (this.dismissSubscription) {
            this.dismissSubscription.unsubscribe();
        }
    }

    private onDismiss = (notif: NotificationSettings): void => {
        if (notif) {
            this.onDestroyed(notif);
        } else {
            this.notifications = [];
        }
    }

    private onDestroyed = (event: any): void => {
        let index: number = this.notifications.indexOf(event);
        if (index !== -1) {
            this.notifications.splice(index, 1);
        }
    }

}
