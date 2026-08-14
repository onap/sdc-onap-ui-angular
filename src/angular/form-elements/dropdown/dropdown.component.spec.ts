import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DropDownComponent } from './dropdown.component';
import { IDropDownOption, DropDownTypes } from "./dropdown-models";
import { DropdownModule } from "./dropdown.module";


const label:string = "DropDown example";
const placeHolder:string = "Please choose option";
const options:IDropDownOption[] = [
    {
        label:'First Option',
        value: 'First Option'
    },
    {
        label:'Second Option',
        value: 'Second Option'
    },
    {
        label:'Third Option',
        value: 'Third Option'
    }
];

describe('DropDown component', () => {
    let fixture: ComponentFixture<DropDownComponent>;
    let component: DropDownComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                DropdownModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
        fixture = TestBed.createComponent(DropDownComponent);
        component = fixture.componentInstance;

    }));

    beforeEach(()=>{
        component.label = label;
        component.placeHolder = placeHolder;
        component.options = options;
        component.type = DropDownTypes.Regular;
        fixture.detectChanges();
    });

    it('component should be created', () => {
        expect(component).toBeTruthy();
    });

    it('component should export the selected value', () => {
        const option = options[1];
        component.selectOption(option);
        fixture.detectChanges();
        expect(component.selectedOption).toEqual(option);
    });

    it('component should toggle its open state', () => {
        expect(component.options.length).toEqual(3);
        expect(component.show).toEqual(false);
        component.toggleDropdown();
        expect(component.show).toEqual(true);
        component.toggleDropdown();
        expect(component.show).toEqual(false);
    });

    it('component should not open while disabled', () => {
        component.disabled = true;
        component.toggleDropdown();
        expect(component.show).toEqual(false);
    });

    // Regression tests for SDC-4885. BaseTextElementComponent defaults placeHolder to '',
    // but a consumer binding an expression that evaluates to undefined overwrites that
    // default. placeholder and value are reflected DOMString properties, so assigning
    // undefined to either stringifies it and paints the word "undefined" in the field.
    describe('when nothing is selected and the consumer supplies no placeholder', () => {

        beforeEach(() => {
            component.placeHolder = undefined;
            fixture.detectChanges();
        });

        it('leaves the field placeholder empty rather than showing "undefined"', () => {
            const field = fixture.nativeElement.querySelector('input.sdc-input__input');
            expect(field.getAttribute('placeholder')).toEqual('');
        });

        it('leaves the hidden value field empty rather than showing "undefined"', () => {
            const hidden = fixture.nativeElement.querySelector('input.sdc-dropdown__value');
            expect(hidden.value).toEqual('');
        });

    });

    it('still renders a placeholder the consumer did supply', () => {
        const field = fixture.nativeElement.querySelector('input.sdc-input__input');
        expect(field.getAttribute('placeholder')).toEqual(placeHolder);
    });

    it('exports a falsy option value as-is instead of coercing it to an empty string', () => {
        component.selectOption({label: 'Zero', value: 0});
        fixture.detectChanges();
        const hidden = fixture.nativeElement.querySelector('input.sdc-dropdown__value');
        expect(hidden.value).toEqual('0');
    });

});
