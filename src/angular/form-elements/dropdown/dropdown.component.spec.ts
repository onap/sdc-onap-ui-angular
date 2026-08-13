import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DropDownComponent } from './dropdown.component';
import { IDropDownOption, DropDownTypes, DropDownOptionType } from "./dropdown-models";
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

    const field = (): HTMLInputElement =>
        fixture.debugElement.query(By.css('input.sdc-input__input')).nativeElement;

    const caret = (): HTMLElement =>
        fixture.debugElement.query(By.css('svg-icon.input-right-icon')).nativeElement;

    const listbox = (): HTMLElement => {
        const found = fixture.debugElement.query(By.css('ul.dropdown-results'));
        return found && found.nativeElement;
    };

    const optionElements = (): HTMLElement[] =>
        fixture.debugElement.queryAll(By.css('li.sdc-dropdown__option')).map(element => element.nativeElement);

    const press = (key: string): KeyboardEvent => {
        const event = new KeyboardEvent('keydown', {key: key, bubbles: true, cancelable: true});
        field().dispatchEvent(event);
        fixture.detectChanges();
        return event;
    };

    const withOptions = (newOptions: IDropDownOption[]): void => {
        component.options = newOptions;
        component.ngOnInit();
        fixture.detectChanges();
    };

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

    describe('click target', () => {

        // Regression test for SDC-4876: the field was rendered with the real disabled
        // attribute, and browsers dispatch no click events from disabled form controls, so
        // the (click) handler on the sdc-input host never fired. Only the caret — a
        // separate, non-disabled sibling whose click bubbles to the same host — worked.
        it('opens when the field itself is clicked', () => {
            expect(component.show).toEqual(false);
            field().click();
            fixture.detectChanges();
            expect(component.show).toEqual(true);
        });

        it('still opens when the caret is clicked', () => {
            caret().click();
            fixture.detectChanges();
            expect(component.show).toEqual(true);
        });

        it('renders the field read-only rather than disabled so it stays focusable', () => {
            expect(field().hasAttribute('disabled')).toEqual(false);
            expect(field().readOnly).toEqual(true);
        });

        it('renders the field disabled when the dropdown is disabled', () => {
            component.disabled = true;
            fixture.detectChanges();
            expect(field().hasAttribute('disabled')).toEqual(true);
        });

        it('does not open when a disabled field is clicked', () => {
            component.disabled = true;
            fixture.detectChanges();
            field().click();
            fixture.detectChanges();
            expect(component.show).toEqual(false);
        });
    });

    describe('combobox semantics', () => {

        it('exposes the combobox role and popup type on the field', () => {
            expect(field().getAttribute('role')).toEqual('combobox');
            expect(field().getAttribute('aria-haspopup')).toEqual('listbox');
        });

        it('reports its expanded state', () => {
            expect(field().getAttribute('aria-expanded')).toEqual('false');
            component.toggleDropdown();
            fixture.detectChanges();
            expect(field().getAttribute('aria-expanded')).toEqual('true');
        });

        it('points aria-controls at the option list', () => {
            component.toggleDropdown();
            fixture.detectChanges();
            expect(listbox().id).toBeTruthy();
            expect(field().getAttribute('aria-controls')).toEqual(listbox().id);
        });

        it('marks the option list as a listbox of options', () => {
            component.selectedOption = options[1];
            component.toggleDropdown();
            fixture.detectChanges();
            expect(listbox().getAttribute('role')).toEqual('listbox');
            expect(optionElements().map(element => element.getAttribute('role')))
                .toEqual(['option', 'option', 'option']);
            expect(optionElements().map(element => element.getAttribute('aria-selected')))
                .toEqual(['false', 'true', 'false']);
        });

        it('hides separators and headers from assistive technology and marks disabled entries', () => {
            withOptions([
                {label: 'Group', value: 'Group', type: DropDownOptionType.Header},
                {label: 'First Option', value: 'First Option'},
                {label: '', value: '', type: DropDownOptionType.HorizontalLine},
                {label: 'Not available', value: 'Not available', type: DropDownOptionType.Disable}
            ]);
            component.toggleDropdown();
            fixture.detectChanges();
            expect(optionElements().map(element => element.getAttribute('role')))
                .toEqual(['presentation', 'option', 'presentation', 'option']);
            expect(optionElements().map(element => element.getAttribute('aria-disabled')))
                .toEqual([null, null, null, 'true']);
        });

        it('gives every instance its own listbox id', () => {
            const other = TestBed.createComponent(DropDownComponent);
            expect(other.componentInstance.listboxId).not.toEqual(component.listboxId);
        });
    });

    describe('keyboard operation', () => {

        it('opens on ArrowDown, ArrowUp, Enter and the space bar', () => {
            ['ArrowDown', 'ArrowUp', 'Enter', ' '].forEach(key => {
                component.closeListOptions();
                fixture.detectChanges();
                press(key);
                expect(component.show).toEqual(true);
            });
        });

        it('closes on Escape', () => {
            press('ArrowDown');
            expect(component.show).toEqual(true);
            press('Escape');
            expect(component.show).toEqual(false);
        });

        // Escape must only be consumed when it actually closed the list, otherwise a
        // surrounding modal can no longer be dismissed with Escape.
        it('lets Escape through when the list is already closed', () => {
            const stopped = press('Escape');
            expect(stopped.cancelBubble).toEqual(false);
        });

        it('closes the list on Tab without blocking focus from leaving', () => {
            press('ArrowDown');
            const event = press('Tab');
            expect(component.show).toEqual(false);
            expect(event.defaultPrevented).toEqual(false);
        });

        it('starts on the selected option when opened with the keyboard', () => {
            component.selectedOption = options[2];
            fixture.detectChanges();
            press('ArrowDown');
            expect(component.activeOption).toEqual(options[2]);
        });

        it('moves the active option with the arrow keys', () => {
            press('ArrowDown');
            expect(component.activeOption).toEqual(options[0]);
            press('ArrowDown');
            expect(component.activeOption).toEqual(options[1]);
            press('ArrowUp');
            expect(component.activeOption).toEqual(options[0]);
        });

        it('stops at the ends of the list', () => {
            press('ArrowDown');
            press('ArrowUp');
            expect(component.activeOption).toEqual(options[0]);
            press('End');
            press('ArrowDown');
            expect(component.activeOption).toEqual(options[2]);
        });

        it('jumps to the first and last option with Home and End', () => {
            press('ArrowDown');
            press('End');
            expect(component.activeOption).toEqual(options[2]);
            press('Home');
            expect(component.activeOption).toEqual(options[0]);
        });

        it('skips headers, separators and disabled entries while navigating', () => {
            const first = {label: 'First Option', value: 'First Option'};
            const second = {label: 'Second Option', value: 'Second Option'};
            withOptions([
                {label: 'Group', value: 'Group', type: DropDownOptionType.Header},
                first,
                {label: '', value: '', type: DropDownOptionType.HorizontalLine},
                {label: 'Not available', value: 'Not available', type: DropDownOptionType.Disable},
                second
            ]);
            press('ArrowDown');
            expect(component.activeOption).toEqual(first);
            press('ArrowDown');
            expect(component.activeOption).toEqual(second);
            press('ArrowUp');
            expect(component.activeOption).toEqual(first);
        });

        it('points aria-activedescendant at the active option only while open', () => {
            expect(field().hasAttribute('aria-activedescendant')).toEqual(false);
            press('ArrowDown');
            press('ArrowDown');
            expect(field().getAttribute('aria-activedescendant')).toEqual(optionElements()[1].id);
            press('Escape');
            expect(field().hasAttribute('aria-activedescendant')).toEqual(false);
        });

        it('marks the active option so a sighted keyboard user can see it', () => {
            press('ArrowDown');
            press('ArrowDown');
            expect(optionElements().map(element => element.classList.contains('active')))
                .toEqual([false, true, false]);
        });

        it('selects the active option with Enter and closes the list', () => {
            press('ArrowDown');
            press('ArrowDown');
            press('Enter');
            expect(component.selectedOption).toEqual(options[1]);
            expect(component.show).toEqual(false);
        });

        it('selects the active option with the space bar', () => {
            press('ArrowDown');
            press(' ');
            expect(component.selectedOption).toEqual(options[0]);
            expect(component.show).toEqual(false);
        });

        it('emits the selection made with the keyboard', () => {
            const selections: IDropDownOption[] = [];
            component.changeEmitter.subscribe((option: IDropDownOption) => selections.push(option));
            press('ArrowDown');
            press('Enter');
            expect(selections).toEqual([options[0]]);
        });

        // A bare Enter inside a form submits it, and the space bar scrolls the page.
        it('consumes the keys it acts on', () => {
            expect(press('ArrowDown').defaultPrevented).toEqual(true);
            expect(press('Enter').defaultPrevented).toEqual(true);
            expect(press(' ').defaultPrevented).toEqual(true);
        });

        it('ignores the keyboard while disabled', () => {
            component.disabled = true;
            fixture.detectChanges();
            press('ArrowDown');
            expect(component.show).toEqual(false);
            press('Enter');
            expect(component.show).toEqual(false);
        });

        it('ignores keys it does not handle', () => {
            const event = press('a');
            expect(component.show).toEqual(false);
            expect(event.defaultPrevented).toEqual(false);
        });
    });
});
