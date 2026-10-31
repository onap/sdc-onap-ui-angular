/*-
 * ============LICENSE_START=======================================================
 * onap-ui-angular
 * ================================================================================
 * Copyright (C) 2026 Deutsche Telekom AG.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { NotificationModule } from './notification.module';
import { NotificationContainerComponent } from './container/notifcontainer.component';
import { NotificationsService } from './services/notifications.service';
import { NotificationSettings } from './utilities/notification.config';

@Component({ selector: 'test-notification-content', template: '<span>{{text}}</span>' })
class CustomNotificationContent {
    @Input() text: string;
}

describe('Notification live region', () => {
    let f: ComponentFixture<NotificationContainerComponent>;
    let service: NotificationsService;
    const container = () => f.nativeElement.querySelector('.sdc-notification-container') as HTMLElement;

    beforeEach(() => {
        TestBed.overrideModule(NotificationModule, {
            add: { declarations: [CustomNotificationContent], entryComponents: [CustomNotificationContent] }
        });
        TestBed.configureTestingModule({
            imports: [NotificationModule]
        });
        service = TestBed.get(NotificationsService);
        f = TestBed.createComponent(NotificationContainerComponent);
        f.detectChanges();
    });

    it('is a polite live region before any notification arrives', () => {
        expect(container().getAttribute('aria-live')).toBe('polite');
        expect(container().getAttribute('aria-relevant')).toBe('additions');
        expect(container().children.length).toBe(0);
    });

    it('announces each notification as a whole, and errors assertively', () => {
        service.push(new NotificationSettings('info', 'Saved', 'Done', 10000, true));
        service.push(new NotificationSettings('error', 'Failed', 'Error', 10000, true));
        f.detectChanges();
        const [info, error] = Array.from(container().querySelectorAll('.sdc-notification')) as HTMLElement[];
        expect(info.getAttribute('aria-atomic')).toBe('true');
        expect(info.hasAttribute('aria-live')).toBe(false);
        expect(error.getAttribute('aria-live')).toBe('assertive');
        expect(error.textContent).toContain('Failed');
    });

    it('renders custom content when a notification arrives after container initialization', () => {
        service.push(new NotificationSettings('info', '', 'Custom', 10000, true, true,
            CustomNotificationContent, { text: 'Dynamic notification body' }));
        f.detectChanges();
        expect(container().querySelector('test-notification-content').textContent).toBe('Dynamic notification body');
    });
});
