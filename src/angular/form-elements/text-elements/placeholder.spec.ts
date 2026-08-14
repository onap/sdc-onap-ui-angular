import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseTextElementComponent } from './base-text-element.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { TextareaComponent } from './textarea/textarea.component';

// Regression tests for SDC-4885 on the text elements that do not render through sdc-input
// (sdc-input itself is covered via sdc-dropdown's spec).
const cases: Array<[string, Type<BaseTextElementComponent>, string]> = [
    ['sdc-textarea', TextareaComponent, 'textarea'],
    ['sdc-number-input', NumberInputComponent, 'input'],
];

cases.forEach(([name, componentType, fieldSelector]) => {
    describe(`${name} placeholder`, () => {
        let fixture: ComponentFixture<BaseTextElementComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ReactiveFormsModule],
                declarations: [componentType],
                schemas: [NO_ERRORS_SCHEMA]
            }).compileComponents();
            fixture = TestBed.createComponent(componentType);
        }));

        it('stays empty rather than showing "undefined" when the consumer binds undefined', () => {
            fixture.componentInstance.placeHolder = undefined;
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector(fieldSelector).getAttribute('placeholder')).toEqual('');
        });

        it('still renders a placeholder the consumer did supply', () => {
            fixture.componentInstance.placeHolder = 'Type here';
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector(fieldSelector).getAttribute('placeholder')).toEqual('Type here');
        });
    });
});
