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
import { AccordionModule } from './accordion.module';

@Component({ template: `<sdc-accordion title="Elements"><p>body</p></sdc-accordion>` })
class HostComponent {}

describe('AccordionComponent accessibility', () => {
    let f: ComponentFixture<HostComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [AccordionModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('header is a keyboard button with aria-expanded and the chevron is not a tab stop', () => {
        const header = f.nativeElement.querySelector('.sdc-accordion-header');
        expect(header.getAttribute('class')).toBe('sdc-accordion-header');
        expect(header.getAttribute('role')).toBe('button');
        expect(header.getAttribute('tabindex')).toBe('0');
        expect(header.getAttribute('aria-expanded')).toBe('false');
        header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        f.detectChanges();
        expect(header.getAttribute('aria-expanded')).toBe('true');
        expect(f.nativeElement.querySelector('svg-icon').hasAttribute('tabindex')).toBe(false);
    });

    it('header controls the body by id', () => {
        const header = f.nativeElement.querySelector('.sdc-accordion-header');
        const body = f.nativeElement.querySelector('.sdc-accordion-body');
        expect(body.id).toMatch(/^sdc-accordion-body-\d+$/);
        expect(header.getAttribute('aria-controls')).toBe(body.id);
    });
});
