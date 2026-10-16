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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from './modal.module';
import { ModalComponent } from './modal.component';

describe('ModalComponent keyboard and dialog semantics', () => {
    let f: ComponentFixture<ModalComponent>;
    let trigger: HTMLButtonElement;
    const root = () => f.nativeElement.querySelector('.sdc-modal') as HTMLElement;
    const focusable = () => Array.prototype.slice.call(root().querySelectorAll('button')) as HTMLButtonElement[];
    const press = (key: string, shiftKey = false) => {
        const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
        (document.activeElement as HTMLElement).dispatchEvent(event);
        return event;
    };

    const open = (title = 'Import VSP') => {
        f = TestBed.createComponent(ModalComponent);
        Object.assign(f.componentInstance, {
            title,
            size: 'sm',
            buttons: [{ text: 'OK', type: 'primary' }, { text: 'Cancel', type: 'secondary' }],
            instanceRef: f.componentRef
        });
        f.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ModalModule, NoopAnimationsModule] });
        trigger = document.createElement('button');
        trigger.textContent = 'IMPORT VSP';
        document.body.appendChild(trigger);
        trigger.focus();
    });

    afterEach(() => {
        trigger.remove();
    });

    it('is a modal dialog named by its title', () => {
        open();
        expect(root().getAttribute('role')).toBe('dialog');
        expect(root().getAttribute('aria-modal')).toBe('true');
        const title = document.getElementById(root().getAttribute('aria-labelledby'));
        expect(title.textContent.trim()).toBe('Import VSP');
    });

    it('has no aria-labelledby without a title', () => {
        open('');
        expect(root().hasAttribute('aria-labelledby')).toBe(false);
    });

    it('moves focus to the close button when it opens', () => {
        open();
        expect(document.activeElement).toBe(root().querySelector('.sdc-modal__close-button'));
    });

    it('keeps Tab and Shift+Tab inside the modal', () => {
        open();
        const [first, , last] = focusable();
        last.focus();
        expect(press('Tab').defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(first);
        expect(press('Tab', true).defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(last);
    });

    it('leaves Tab between inner controls to the browser', () => {
        open();
        focusable()[0].focus();
        expect(press('Tab').defaultPrevented).toBe(false);
    });

    it('closes like the close button on Escape', () => {
        open();
        const closed = jest.fn();
        f.componentInstance.onClose.subscribe(closed);
        expect(press('Escape').defaultPrevented).toBe(true);
        expect(closed).toHaveBeenCalledWith('close');
        expect(f.componentInstance.modalVisible).toBe(false);
    });

    it('ignores an Escape that an inner control already handled', () => {
        open();
        const closed = jest.fn();
        f.componentInstance.onClose.subscribe(closed);
        const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        event.preventDefault();
        root().querySelector('.sdc-modal__close-button').dispatchEvent(event);
        expect(closed).not.toHaveBeenCalled();
    });

    it('returns focus to the element that opened it', () => {
        open();
        focusable()[1].focus();
        f.destroy();
        expect(document.activeElement).toBe(trigger);
    });

    it('falls back to the nearest focusable ancestor when the opener cannot take focus', () => {
        const card = document.createElement('div');
        card.tabIndex = 0;
        document.body.appendChild(card);
        card.appendChild(trigger);
        trigger.focus();
        open();
        focusable()[1].focus();
        // jsdom has no layout, so stand in for an opener hidden meanwhile with one that refuses focus.
        trigger.focus = () => undefined;
        f.destroy();
        expect(document.activeElement).toBe(card);
        card.remove();
    });

    it('does not take focus back from a modal opened after it', () => {
        open();
        const next = document.createElement('button');
        document.body.appendChild(next);
        next.focus();
        f.destroy();
        expect(document.activeElement).toBe(next);
        next.remove();
    });
});
