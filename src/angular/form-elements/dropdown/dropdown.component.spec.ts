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

});
