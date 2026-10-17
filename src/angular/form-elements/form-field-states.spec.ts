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
import { FormElementsModule } from './form-elements.module';
import { ValidationModule } from './validation/validation.module';

@Component({ template: `
    <sdc-input #name label="Name" [required]="true" testId="name"></sdc-input>
    <sdc-validation [validateElement]="name">
        <sdc-required-validator message="Name is required."></sdc-required-validator>
    </sdc-validation>
    <sdc-textarea #desc label="Description" [required]="true" testId="desc"></sdc-textarea>
    <sdc-validation [validateElement]="desc">
        <sdc-required-validator message="Description is required."></sdc-required-validator>
    </sdc-validation>
    <sdc-number-input label="Count" testId="count"></sdc-number-input>
    <sdc-input label="Optional" testId="opt"></sdc-input>` })
class HostComponent {}

describe('Form field states for assistive technology', () => {
    let f: ComponentFixture<HostComponent>;
    const field = (tid: string) => f.nativeElement.querySelector(`[data-tests-id="${tid}"]`) as HTMLElement;
    const validations = () => Array.from(f.nativeElement.querySelectorAll('sdc-validation')) as HTMLElement[];
    const type = (el: HTMLElement, value: string) => {
        (el as HTMLInputElement).value = value;
        el.dispatchEvent(new Event('input'));
        f.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [FormElementsModule, ValidationModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('marks required fields and leaves optional ones alone', () => {
        expect(field('name').getAttribute('aria-required')).toBe('true');
        expect(field('desc').getAttribute('aria-required')).toBe('true');
        expect(field('opt').hasAttribute('aria-required')).toBe(false);
    });

    it('associates every visible label with its field', () => {
        const desc = field('desc');
        const descLabel = f.nativeElement.querySelector(`label[for="${desc.id}"]`);
        expect(descLabel.textContent.trim()).toBe('Description');
        const count = field('count');
        expect(f.nativeElement.querySelector(`label[for="${count.id}"]`).textContent.trim()).toBe('Count');
    });

    it('names the number spinner buttons', () => {
        const buttons = Array.from(f.nativeElement.querySelectorAll('.sdc-input__spinner-buttons button')) as HTMLElement[];
        expect(buttons.map(b => b.getAttribute('aria-label'))).toEqual(['Increase', 'Decrease']);
    });

    it('validation messages live in a polite region', () => {
        validations().forEach(v => {
            expect(v.getAttribute('aria-live')).toBe('polite');
            expect(v.id).toMatch(/^sdc-validation-\d+$/);
        });
    });

    it('flags an invalid field and points it at its message, then clears both', () => {
        const name = field('name');
        type(name, 'x');
        type(name, '');
        const [nameValidation] = validations();
        expect(name.getAttribute('aria-invalid')).toBe('true');
        expect(name.getAttribute('aria-describedby')).toBe(nameValidation.id);
        expect(nameValidation.textContent).toContain('Name is required.');
        type(name, 'ok');
        expect(name.hasAttribute('aria-invalid')).toBe(false);
        expect(name.hasAttribute('aria-describedby')).toBe(false);

        const desc = field('desc');
        type(desc, 'x');
        type(desc, '');
        expect(desc.getAttribute('aria-invalid')).toBe('true');
        expect(desc.getAttribute('aria-describedby')).toBe(validations()[1].id);
    });
});
