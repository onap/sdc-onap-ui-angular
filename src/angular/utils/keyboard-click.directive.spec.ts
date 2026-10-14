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

import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonDirectiveModule } from './common-directive.module';

@Component({
    template: `
        <div id="btn" sdcKeyboardClick (click)="clicks = clicks + 1">
            <button id="inner" (click)="inner = inner + 1">x</button>
        </div>
        <a id="lnk" sdcKeyboardClick="link" (click)="links = links + 1">Home</a>
        <span id="off" sdcKeyboardClick [sdcKeyboardClickDisabled]="off" (click)="clicks = clicks + 1"></span>
        <div id="own" sdcKeyboardClick tabindex="-1" role="tab"></div>`
})
class HostComponent { clicks = 0; inner = 0; links = 0; off = true; }

describe('SdcKeyboardClickDirective', () => {
    let fixture: ComponentFixture<HostComponent>;
    const el = (id: string) => fixture.nativeElement.querySelector('#' + id) as HTMLElement;
    const key = (target: HTMLElement, k: string, repeat: boolean = false) => {
        const ev = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, repeat });
        target.dispatchEvent(ev);
        return ev;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [CommonDirectiveModule], declarations: [HostComponent] });
        fixture = TestBed.createComponent(HostComponent);
        fixture.detectChanges();
    });

    it('makes the host focusable with a role', () => {
        expect(el('btn').getAttribute('role')).toBe('button');
        expect(el('btn').getAttribute('tabindex')).toBe('0');
        expect(el('lnk').getAttribute('role')).toBe('link');
    });

    it('keeps role and tabindex the template already set', () => {
        expect(el('own').getAttribute('role')).toBe('tab');
        expect(el('own').getAttribute('tabindex')).toBe('-1');
    });

    it('activates a button on Enter and Space and suppresses Space scrolling', () => {
        key(el('btn'), 'Enter');
        const space = key(el('btn'), ' ');
        expect(fixture.componentInstance.clicks).toBe(2);
        expect(space.defaultPrevented).toBe(true);
    });

    it('activates a link on Enter only', () => {
        key(el('lnk'), 'Enter');
        key(el('lnk'), ' ');
        expect(fixture.componentInstance.links).toBe(1);
    });

    it('ignores auto-repeated keydowns', () => {
        key(el('btn'), 'Enter', true);
        expect(fixture.componentInstance.clicks).toBe(0);
    });

    it('ignores keys aimed at a native control inside the host', () => {
        key(el('inner'), 'Enter');
        expect(fixture.componentInstance.clicks).toBe(0);
    });

    it('is inert and untabbable while disabled, and recovers when re-enabled', () => {
        key(el('off'), 'Enter');
        expect(fixture.componentInstance.clicks).toBe(0);
        expect(el('off').getAttribute('aria-disabled')).toBe('true');
        expect(el('off').getAttribute('tabindex')).toBe('-1');
        fixture.componentInstance.off = false;
        fixture.detectChanges();
        expect(el('off').hasAttribute('aria-disabled')).toBe(false);
        expect(el('off').getAttribute('tabindex')).toBe('0');
    });
});
