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
import { ButtonType } from '../common/enums';

@Component({ template: `
    <sdc-button id="t" type="tertiary" icon_name="plus" icon_position="left" text="Add Property" testId="add-property"></sdc-button>
    <sdc-button id="d" type="tertiary" text="Add Input" [disabled]="true"></sdc-button>` })
class HostComponent {}

describe('ButtonComponent tertiary type', () => {
    let f: ComponentFixture<HostComponent>;
    const button = (id: string) => f.nativeElement.querySelector(`#${id} > button`) as HTMLButtonElement;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ButtonsModule, SvgIconModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('is a ButtonType, as is link', () => {
        expect(ButtonType.tertiary).toBe('tertiary');
        expect(ButtonType.link).toBe('link');
    });

    it('renders the onap-ui-common tertiary classes on the native button', () => {
        const classes = button('t').className.split(/\s+/);
        expect(classes).toEqual(expect.arrayContaining(['sdc-button', 'sdc-button__tertiary', 'btn-default', 'sdc-icon-left']));
        expect(button('t').getAttribute('data-tests-id')).toBe('add-property');
    });

    it('puts the icon before the text and keeps the label as the accessible name', () => {
        const icon = button('t').firstElementChild;
        expect(icon.tagName).toBe('SVG-ICON');
        expect(icon.getAttribute('aria-hidden')).toBe('true');
        expect(icon.querySelector('span.svg-icon svg')).not.toBeNull();
        expect(button('t').textContent.trim()).toBe('Add Property');
    });

    it('renders no icon when none is named, and disables the native button', () => {
        expect(button('d').querySelector('svg-icon')).toBeNull();
        expect(button('d').disabled).toBe(true);
    });
});
