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

@Component({ template: `<sdc-accordion title="Elements" [disabled]="off"><p>body</p></sdc-accordion>` })
class HostComponent { off = false; }

@Component({ template: `<sdc-accordion title="Elements" css-class="custom other" [disabled]="off"><p>body</p></sdc-accordion>` })
class CustomClassHostComponent { off = false; }

describe('AccordionComponent accessibility', () => {
    let f: ComponentFixture<HostComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [AccordionModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('header is a native button with aria-expanded, a span title and a hidden chevron', () => {
        const header = f.nativeElement.querySelector('.sdc-accordion-header') as HTMLButtonElement;
        expect(header.tagName).toBe('BUTTON');
        expect(header.getAttribute('type')).toBe('button');
        expect(header.getAttribute('class')).toBe('sdc-accordion-header');
        ['role', 'tabindex'].forEach(a => expect(header.hasAttribute(a)).toBe(false));
        expect(header.querySelector('.title').tagName).toBe('SPAN');
        expect(header.querySelector('.svg-icon-wrapper').tagName).toBe('SPAN');
        expect(header.disabled).toBe(false);
        expect(header.querySelector('div')).toBeNull();
        expect(header.querySelector('.title').textContent.trim()).toBe('Elements');
        const chevron = header.querySelector('svg-icon');
        expect(chevron.getAttribute('aria-hidden')).toBe('true');
        expect(chevron.querySelector('button')).toBeNull();
    });

    it('a click toggles aria-expanded and the body', () => {
        const header = f.nativeElement.querySelector('.sdc-accordion-header') as HTMLButtonElement;
        const body = f.nativeElement.querySelector('.sdc-accordion-body');
        expect(header.getAttribute('aria-expanded')).toBe('false');
        header.click();
        f.detectChanges();
        expect(header.getAttribute('aria-expanded')).toBe('true');
        expect(body.classList.contains('open')).toBe(true);
        header.click();
        f.detectChanges();
        expect(header.getAttribute('aria-expanded')).toBe('false');
    });

    it('Enter is left to the native button, so a keydown does not toggle on its own', () => {
        const header = f.nativeElement.querySelector('.sdc-accordion-header') as HTMLButtonElement;
        header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        f.detectChanges();
        expect(header.getAttribute('aria-expanded')).toBe('false');
    });

    it('header controls the body by id', () => {
        const header = f.nativeElement.querySelector('.sdc-accordion-header');
        const body = f.nativeElement.querySelector('.sdc-accordion-body');
        expect(body.id).toMatch(/^sdc-accordion-body-\d+$/);
        expect(header.getAttribute('aria-controls')).toBe(body.id);
    });

    it('a disabled accordion disables its header button, which then ignores clicks', () => {
        f.componentInstance.off = true;
        f.detectChanges();
        const header = f.nativeElement.querySelector('.sdc-accordion-header') as HTMLButtonElement;
        expect(header.disabled).toBe(true);
        expect(f.nativeElement.querySelector('.sdc-accordion').classList.contains('disabled')).toBe(true);
        header.click();
        f.detectChanges();
        expect(header.getAttribute('aria-expanded')).toBe('false');
    });

    it('merges the disabled class with css-class', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({ imports: [AccordionModule], declarations: [CustomClassHostComponent] });
        const c = TestBed.createComponent(CustomClassHostComponent);
        c.detectChanges();
        const root = c.nativeElement.querySelector('.sdc-accordion');
        expect(root.getAttribute('class')).toBe('sdc-accordion custom other');
        c.componentInstance.off = true;
        c.detectChanges();
        expect(root.getAttribute('class')).toBe('sdc-accordion custom other disabled');
    });
});
