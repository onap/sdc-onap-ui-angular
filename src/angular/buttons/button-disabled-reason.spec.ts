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
import { ButtonsModule } from './buttons.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';

@Component({ template: `
    <form (submit)="submits = submits + 1; $event.preventDefault()">
        <input id="field">
        <sdc-button id="b" type="tertiary" text="Add Property" [disabled]="disabled" [disabledReason]="reason"
                    [show_spinner]="spinner" (click)="clicks = clicks + 1"></sdc-button>
    </form>` })
class HostComponent {
    disabled = false;
    reason: string;
    spinner = false;
    clicks = 0;
    submits = 0;
}

describe('ButtonComponent type and disabledReason', () => {
    let f: ComponentFixture<HostComponent>;
    let host: HostComponent;
    const button = () => f.nativeElement.querySelector('#b > button') as HTMLButtonElement;
    const render = (state: Partial<HostComponent>) => {
        Object.assign(host, state);
        f.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ButtonsModule, SvgIconModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        host = f.componentInstance;
        f.detectChanges();
    });

    it('is a plain button, so a click inside a form does not submit it', () => {
        expect(button().type).toBe('button');
        button().click();
        expect(host.clicks).toBe(1);
        expect(host.submits).toBe(0);
    });

    it('is natively disabled when no reason is given', () => {
        render({ disabled: true });
        expect(button().disabled).toBe(true);
        expect(button().hasAttribute('aria-disabled')).toBe(false);
        expect(button().hasAttribute('title')).toBe(false);
    });

    it('stays focusable and carries the reason when one is given', () => {
        render({ disabled: true, reason: 'Check out the asset to add properties' });
        expect(button().disabled).toBe(false);
        expect(button().getAttribute('aria-disabled')).toBe('true');
        expect(button().getAttribute('title')).toBe('Check out the asset to add properties');
        button().focus();
        expect(document.activeElement).toBe(button());
    });

    it('does not pass a click on an explained disabled button to the host', () => {
        render({ disabled: true, reason: 'Check out the asset to add properties' });
        button().click();
        expect(host.clicks).toBe(0);
        expect(host.submits).toBe(0);
    });

    it('ignores the reason while enabled', () => {
        render({ reason: 'Check out the asset to add properties' });
        expect(button().disabled).toBe(false);
        expect(button().hasAttribute('aria-disabled')).toBe(false);
        expect(button().hasAttribute('title')).toBe(false);
        button().click();
        expect(host.clicks).toBe(1);
    });

    it('is natively disabled while the spinner shows, reason or not', () => {
        render({ disabled: true, reason: 'Saving', spinner: true });
        expect(button().disabled).toBe(true);
        expect(button().hasAttribute('aria-disabled')).toBe(false);
    });
});
